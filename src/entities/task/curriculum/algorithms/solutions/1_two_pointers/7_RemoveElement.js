const removeElement = (nums, val) => {
  let write = 0;

  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== val) {
      nums[write] = nums[read];
      write++;
    }
  }

  return write;
};

// Пример вызова:
const nums1 = [5, 1, 5, 5, 2];
const k1 = removeElement(nums1, 5);
console.log(k1, nums1.slice(0, k1)); // 2 [1, 2]

const nums2 = [4, 4, 0, 7, 4, 9];
const k2 = removeElement(nums2, 4);
console.log(k2, nums2.slice(0, k2)); // 3 [0, 7, 9]
