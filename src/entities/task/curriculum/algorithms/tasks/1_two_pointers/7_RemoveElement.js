// Напишите функцию removeElement(nums, val), которая удаляет из массива nums
// все элементы, равные val, и возвращает длину оставшегося префикса k.
//
// Изменяйте nums на месте: первые k элементов должны содержать все значения,
// не равные val. Порядок оставшихся элементов нужно сохранить.

const removeElement = (nums, val) => {
  // Решение тут
};

// Пример вызова:
const nums1 = [3, 2, 2, 3];
const k1 = removeElement(nums1, 3);
console.log(k1, nums1.slice(0, k1)); // 2 [2, 2]

const nums2 = [0, 1, 2, 2, 3, 0, 4, 2];
const k2 = removeElement(nums2, 2);
console.log(k2, nums2.slice(0, k2)); // 5 [0, 1, 3, 0, 4]
