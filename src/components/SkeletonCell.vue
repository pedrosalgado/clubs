<template>
  <div class="skeletonBox"></div>
</template>

<style scoped>
body {
  margin: 0;
}

.skeletonBox {
  min-width: 16px;
  max-width: 100%;
  position: relative;
  height: 16px;
  border-radius: 4px;
  background-image: linear-gradient(
    90deg,
    #f4f4f4 0px,
    rgba(229, 229, 229, 0.8) 40px,
    #f4f4f4 80px
  );
  background-size: 600px;
  animation: shine-lines 2s infinite ease-out;
}

@keyframes shine-lines {
  0% {
    background-position: -100px;
  }
  40%,
  100% {
    background-position: 140px;
  }
}
</style>
