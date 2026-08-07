// Что выведет код и через какие промежутки времени?

let count = 0;

const intervalId = setInterval(() => {
    count++;
    console.log(count);
    if (count === 3) {
        clearInterval(intervalId);
    }
}, 1000);
