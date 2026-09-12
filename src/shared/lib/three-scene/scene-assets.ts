import {
  CanvasTexture,
  Line,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  type Object3D,
} from "three";

export interface ScenePalette {
  readonly surface: string;
  readonly text: string;
  readonly muted: string;
  readonly border: string;
  readonly primary: string;
  readonly secondary: string;
  readonly anchor: string;
  readonly success: string;
  readonly font: string;
}

export const readScenePalette = (host: HTMLElement): ScenePalette => {
  const styles = getComputedStyle(host);
  const read = (name: string): string => styles.getPropertyValue(name).trim();
  return {
    surface: read("--trace-tile-surface"),
    text: read("--text-main"),
    muted: read("--text-dimmed"),
    border: read("--text-placeholder"),
    primary: read("--accent-blue"),
    secondary: read("--accent-purple"),
    anchor: read("--accent-orange"),
    success: read("--accent-green"),
    font: read("--font-mono"),
  };
};

export const makeLabel = (
  text: string,
  color: string,
  font: string,
  width = 1.1,
  fontSize = 56
): Sprite => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  context.font = `500 ${fontSize}px ${font}`;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, 256, 64, 496);
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  const sprite = new Sprite(new SpriteMaterial({ map, transparent: true, depthTest: false }));
  sprite.scale.set(width, width / 4, 1);
  sprite.renderOrder = 2;
  return sprite;
};

/**
 * Text sprite whose glyphs keep a fixed world height: the texture is sized to
 * the text itself (no horizontal squeeze) and the sprite grows with the string,
 * clamped to `maxWidth` so long labels shrink to fit their container instead of
 * smearing.
 */
export const makeFittedLabel = (
  text: string,
  color: string,
  font: string,
  height: number,
  fontSize = 64,
  maxWidth?: number
): Sprite => {
  const { map, aspect } = createLabelTexture(text, color, font, fontSize);
  const sprite = new Sprite(new SpriteMaterial({ map, transparent: true, depthTest: false }));
  const fitted = maxWidth && height * aspect > maxWidth ? maxWidth / aspect : height;
  sprite.scale.set(fitted * aspect, fitted, 1);
  sprite.renderOrder = 2;
  return sprite;
};

/**
 * Text painted onto a quad in the parent's local XY plane: it tilts, rotates
 * and moves with the geometry instead of billboarding towards the camera.
 */
export const makeFaceLabel = (
  text: string,
  color: string,
  font: string,
  height: number,
  fontSize = 64,
  maxWidth?: number
): Mesh => {
  const { map, aspect } = createLabelTexture(text, color, font, fontSize);
  const fitted = maxWidth && height * aspect > maxWidth ? maxWidth / aspect : height;
  const mesh = new Mesh(
    new PlaneGeometry(fitted * aspect, fitted),
    new MeshBasicMaterial({ map, transparent: true, depthWrite: false })
  );
  mesh.renderOrder = 2;
  return mesh;
};

const createLabelTexture = (
  text: string,
  color: string,
  font: string,
  fontSize: number
): { map: CanvasTexture; aspect: number } => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D is unavailable");
  const spec = `500 ${fontSize}px ${font}`;
  context.font = spec;
  const measured = Math.max(fontSize * 0.35, context.measureText(text).width);
  canvas.width = Math.ceil(measured + fontSize * 0.6);
  canvas.height = Math.ceil(fontSize * 1.42);
  context.font = spec;
  context.fillStyle = color;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, canvas.width / 2, canvas.height / 2);
  const map = new CanvasTexture(canvas);
  map.colorSpace = SRGBColorSpace;
  return { map, aspect: canvas.width / canvas.height };
};

export const disposeLabel = (label: Sprite): void => {
  label.material.map?.dispose();
  label.material.dispose();
  label.removeFromParent();
};

export const disposeSceneObject = (object: Object3D): void => {
  object.traverse((child) => {
    if (child instanceof Sprite) {
      child.material.map?.dispose();
      child.material.dispose();
    } else if (child instanceof Mesh || child instanceof Line) {
      child.geometry.dispose();
      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if ("map" in material && material.map) material.map.dispose();
        material.dispose();
      });
    }
  });
  object.removeFromParent();
  object.clear();
};
