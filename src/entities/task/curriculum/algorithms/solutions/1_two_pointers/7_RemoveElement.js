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
const nums1 = [3, 2, 2, 3];
const k1 = removeElement(nums1, 3);
console.log(k1, nums1.slice(0, k1)); // 2 [2, 2]

const nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
const k2 = removeElement(nums2, 2);
console.log(k2, nums2.slice(0, k2)); // 5 [0, 1, 3, 0, 4]
