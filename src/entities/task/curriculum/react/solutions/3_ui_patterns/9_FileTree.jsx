import React, { useState } from 'react';

const TREE = {
  name: 'src',
  children: [
    { name: 'index.js' },
    {
      name: 'components',
      children: [
        { name: 'Button.jsx' },
        { name: 'Modal.jsx' },
        { name: 'forms', children: [{ name: 'Input.jsx' }, { name: 'Select.jsx' }] },
      ],
    },
    { name: 'utils', children: [{ name: 'format.js' }] },
  ],
};

const isFolder = (node) => Array.isArray(node.children);

// Рекурсивный подсчёт: файл = 1, папка = сумма по детям
const countFiles = (node) =>
  isFolder(node) ? node.children.reduce((sum, child) => sum + countFiles(child), 0) : 1;

const TreeNode = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const indent = { paddingLeft: depth * 16 };

  if (!isFolder(node)) {
    return <li style={indent}>📄 {node.name}</li>;
  }

  return (
    <li>
      <button style={indent} onClick={() => setIsOpen((prev) => !prev)} aria-expanded={isOpen}>
        {isOpen ? '📂' : '📁'} {node.name} ({countFiles(node)})
      </button>
      {/* Компонент рендерит сам себя для вложенных узлов — база рекурсии: файл или свёрнутая папка */}
      {isOpen && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.name} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const FileTree = () => (
  <ul>
    <TreeNode node={TREE} depth={0} />
  </ul>
);

export default FileTree;
