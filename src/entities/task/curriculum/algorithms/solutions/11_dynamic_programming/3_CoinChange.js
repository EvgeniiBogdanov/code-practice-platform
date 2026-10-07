const coinChange = (coins, amount) => {
  // dp[sum] — минимальное число монет для суммы sum; Infinity значит «пока недостижима»
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;

  for (let sum = 1; sum <= amount; sum++) {
    for (const coin of coins) {
      if (coin <= sum) {
        dp[sum] = Math.min(dp[sum], dp[sum - coin] + 1);
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
};

// Пример вызова:
console.log(coinChange([1, 2, 5], 11)); // 3
console.log(coinChange([2], 3));        // -1
console.log(coinChange([1], 0));        // 0
