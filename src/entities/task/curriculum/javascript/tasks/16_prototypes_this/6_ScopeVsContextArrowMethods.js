// Что выведет данный код в консоль и почему?

const obj = {
  name: "Outer",
  getName() {
    return () => {
      console.log(this.name);
    };
  },
};

const fn = obj.getName();
fn();

const stolen = obj.getName.call({ name: "Inner" });
stolen();
