// Напишите функцию removeElement(nums, val), которая убирает из массива nums
// все значения, равные val, и возвращает количество оставшихся k.
//
// Работайте на месте: оставшиеся значения должны занять первые k ячеек nums,
// сохранив свой порядок. Содержимое массива после позиции k не важно.

const removeElement = (nums, val) => {
  // Решение тут
};

// Пример вызова:
const nums1 = [5, 1, 5, 5, 2];
const k1 = removeElement(nums1, 5);
console.log(k1, nums1.slice(0, k1)); // 2 [1, 2]

const nums2 = [4, 4, 0, 7, 4, 9];
const k2 = removeElement(nums2, 4);
console.log(k2, nums2.slice(0, k2)); // 3 [0, 7, 9]
