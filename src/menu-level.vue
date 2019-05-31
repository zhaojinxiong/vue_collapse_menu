<template>
  <ul class="header-allnav-common-list"  @mouseover="addHover($event)"
    @mouseleave="removeHover($event)">
    <template v-for="menuitem in menuList">
      <li class="header-allnav-common-item" :key="menuitem.typekey" :data-key="menuitem.typekey">
        {{menuitem.name}}
        <i class="header-icon-arrow-right"></i>
      </li>
    </template>
  </ul>
</template>

<script>
  import utils from './utils/utils'
  export default {
    name: 'menu-level',
    props: {
      menuList: {
        type: Array,
        required: true
      },
      nav_level: {
        type: String,
        required: true
      }
    },
    watch: {},
    data() {
      return {
        isHover: false,
        allnav_level: "header-allnav-level",
        menuDebounce: null,
      }
    },
    mounted: function () {
      this.menuDebounce = utils.debounce(100);
    },
    methods: {
      addHover(ev) {

        var target = ev.target || ev.srcElement;
        if (target.nodeName.toLowerCase() == 'li') {
          this.menuDebounce(() => {
            this.$emit('statetest', this.nav_level, target.dataset.key, "show");
          });
        }
      },
      removeHover(ev) {
        var target = ev.target || ev.srcElement;
        if (target.nodeName.toLowerCase() == 'ul') {
          this.menuDebounce(() => {
            this.$emit('statetest', this.nav_level, target.dataset.key, "hide");
          });

        }
      }
    }
  }

</script>

<style scoped>
  @import './css/menu_level.css';

  /* 可以设置不同的进入和离开动画 */
  /* 设置持续时间和动画函数 */
  .slide-fade-enter-active {
    -ms-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    -webkit-transition: 0.3s;
    transition: 0.3s;
  }

  .slide-fade-leave-active {
    -ms-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    transition: 0.3s;
    -webkit-transition: 0.3s;
  }

</style>
