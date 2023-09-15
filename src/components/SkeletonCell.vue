<template>
    <div class="skeletonBox"></div>
</template>

<style scoped>
body{
  margin: 0;
}

.container{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.skeletonBox{
  min-width: 20px;
  max-width: 100%;
  position: relative;
  height: 16px;
  margin-top: 12px;
  border-radius: 7px;
  background-image: linear-gradient(90deg, #F4F4F4 0px, rgba(229,229,229,0.8) 40px, #F4F4F4 80px);
  background-size: 600px;
  animation: shine-lines 2.0s infinite ease-out;
}


@keyframes shine-lines{
  0% { background-position: -100px;}
  40%, 100% {background-position: 140px;}
}

</style>
