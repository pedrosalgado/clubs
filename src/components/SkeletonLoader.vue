<template>
    <div class="skeletonBox"></div>
</template>

<style scoped>
.skeleton-loader {
}

.skeletonBox {
  width: 100%; /* Adjust as needed */
  height: 300px; /* Adjust as needed */
  display: inline-block;
  position: absolute;
  left: 0;
  overflow: hidden;
  vertical-align: middle;
  background-color: #898989;
}

.skeletonBox::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform: translateX(-100%);
  background-image: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 5s infinite;
  content: '';
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}

</style>
