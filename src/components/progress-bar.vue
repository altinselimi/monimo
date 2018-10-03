<template>
	<div class="progressbar" :style="percentage">
    </div>
</template>
<script>
export default {
	props:['progress'],
	computed:{
        percentage(){
            return `transform: translateX(${this.progress}%)`
        },
	}
}		
</script>
<style lang="scss">
.progressbar{
  position: absolute;
  height:5px;
  background-color: #2196f3;
  border-radius: 2px;
  width:100%;
  bottom:0;
  left:0;
  transition: 0.5s cubic-bezier(0.65, 0.05, 0.36, 1);
  &:hover:before{
    position: absolute;
    content: 'Downloading update...';
    padding: 4px 2px;
    top: -26px;
    left: 10.8%;
    border-radius: 4px;
    font-size: 13px;
    margin-bottom: 20px;
    background-color: #2196f3;
    transition: 0.8s ease-in-out;
  }
}
</style>