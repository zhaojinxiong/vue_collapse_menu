<template>
  <div id="header" ref="header" :class="{'show_allnav' : allnav_show}">
    <div class="header-container">
      <div class="header-wrapper">
        <div class="header-top">
          <div class="header-main">
            <div :class="['header-menu']" ref="headerMenu" @mouseover="addHover($event)"
              @mouseleave="removeHover($event)">
              <i class="header-icon-menu"></i>
            </div>
          </div>
        </div>

        <div class="header-allnav" ref="allNav" :class="{'show' : allnav_show}">
          <div class="header-allnav-wrapper" ref="allNavWrapper" @mouseover="addWrapperHover($event)"
            @mouseout="removeWrapperhover_out($event)" @mouseleave="removeWrapperHover($event)">

            <transition name="fade">
              <ul class="header-allnav-level header-allnav-level1" ref="allnavLevel1" v-show="level1_fade"
                :style="{'z-index':level1_zindex}">
                <li class="header-allnav-inner show">
                  <menuLevel :menuList="menuList" nav_level="allnavLevel2" @statetest="stateEvent"></menuLevel>
                </li>
                <li class="header-allnav-consult">
                </li>
              </ul>
            </transition>

            <transition name="fade">
              <ul class="header-allnav-level header-allnav-level2" ref="allnavLevel2" v-show="level2_fade"
                :style="{'z-index':level2_zindex}">
                <li class="header-allnav-inner">
                  <menuLevel :menuList="menuList_level2" nav_level="allnavLevel3" @statetest="stateEvent"></menuLevel>
                </li>
              </ul>
            </transition>

            <transition name="fade">
              <ul class="header-allnav-level header-allnav-level3" ref="allnavLevel3" v-show="level3_fade">
                <li class="header-allnav-inner header-allnav-inner-product" data-name="产品-推荐">
                  <menuLevel :menuList="menuList_level3" nav_level="" @statetest="stateEvent"></menuLevel>
                </li>
              </ul>
            </transition>

          </div>
        </div>

      </div>
    </div>
  </div>

</template>

<script>
  import utils from './utils/utils'
  import menuLevel from './menu-level'
  export default {
    name: 'collapseMenu',
    components: {
      menuLevel
    },
    data() {
      return {
        DELAY_ALLNAV: 300, // 鼠标进入次级菜单的反应延时
        LOW_DELAY_ALLNAV: 0, // 鼠标同级菜单内移动的反应延时
        isHover: false,
        allnav_show: false,
        mouseLocus: [],
        DELAY_NAV: 300,
        MOUSE_LOCUS_LENGTH: 3,
        allNavDebounce: null,
        menuDebounce: null,

        level1_fade: false,
        level2_fade: false,
        level3_fade: false,
        level1_zindex: "",
        level2_zindex: "",

        // 获取 header-allnav-level 
        allnavLevel: "",

        menuList: [{
            name: "了解华为云",
            typekey: "aboutUs"
          },
          {
            name: "产品",
            typekey: "product"
          },
          {
            name: "解决方案",
            typekey: "solution"
          },
          {
            name: "企业智能",
            typekey: "ei"
          },
          {
            name: "最新活动",
            typekey: "active"
          }
        ],

        menuList_level2: [{
            name: "推荐",
            typekey: "产品-推荐"
          },
          {
            name: "基础服务",
            typekey: "基础服务"
          },
          {
            name: "EI企业智能",
            typekey: "EI企业智能"
          },
          {
            name: "开发者",
            typekey: "开发者"
          },
          {
            name: "安全",
            typekey: "安全"
          }
        ],
        menuList_level3: [{
            name: "推荐1",
            typekey: "产品-推荐"
          },
          {
            name: "基础服务1",
            typekey: "基础服务"
          },
          {
            name: "EI企业智能1",
            typekey: "EI企业智能"
          },
          {
            name: "开发者1",
            typekey: "开发者"
          },
          {
            name: "安全1",
            typekey: "安全"
          }
        ],
      }
    },
    mounted: function () {
      window.addEventListener('mousemove', (e) => {
        let mousePoint = {
          x: e.pageX,
          y: e.pageY,
        };
        this.mouseLocus.push(mousePoint);
        if (this.mouseLocus.length > this.MOUSE_LOCUS_LENGTH) {
          this.mouseLocus.shift();
        }
      });
      this.allNavDebounce = utils.debounce(this.DELAY_ALLNAV);
      this.menuDebounce = utils.debounce(100);

      this.$refs.allnavLevel1.addEventListener('aftershow', () => {

      });
      this.$refs.allnavLevel1.addEventListener('beforeshow', () => {
        this.level1_fade = true;
        this.level1_zindex = 30;

      });
      this.$refs.allnavLevel2.addEventListener('aftershow', () => {

      });
      this.$refs.allnavLevel2.addEventListener('aftershide', () => {
        this.level2_zindex = "";
        this.level1_zindex = 0;
      });

      this.$refs.allnavLevel1.addEventListener('afterhide', () => {
        let name = "" + this.$refs.headerMenu.className;
        if (!name.indexOf('hover')) {
          this.setAllNavState('hide');
        }
      });

      this.$refs.allnavLevel2.addEventListener('beforeshow', () => {
        this.level2_fade = true;
        this.level2_zindex = 20
      });
      this.$refs.allnavLevel3.addEventListener('beforeshow', () => {
        this.level3_fade = true;
      });
      this.$refs.allnavLevel1.addEventListener('beforehide', () => {
        this.level1_fade = false;
      });

      this.$refs.allnavLevel2.addEventListener('beforehide', () => {
        this.level2_fade = false;
      });

      this.$refs.allnavLevel3.addEventListener('beforehide', () => {
        this.level3_fade = false;
      });

      this.$refs.allNav.addEventListener('aftershow', () => {
        // 因为菜单移出隐藏一级菜单的函数使用了setTimeout, 这里也使用setTimeout保证显示函数能隐藏函数之后执行
        setTimeout(() => {
          this.setLevelnavState(this.$refs.allnavLevel1, 'show');
        }, 0);
      });
      this.$refs.allNav.addEventListener('beforeshow', () => {
        console.log('allNav beforeshow 派发事件');
      });

      this.$refs.allNav.addEventListener('afterhide', () => {
        // 因为菜单移出隐藏一级菜单的函数使用了setTimeout, 这里也使用setTimeout保证显示函数能隐藏函数之后执行
        setTimeout(() => {
          this.setLevelnavState(this.$refs.allnavLevel1, 'show');
        }, 0);
      });
      this.$refs.allNav.addEventListener('beforehide', () => {
        console.log('allNav beforehide 派发事件');
      });
    },

    methods: {
      // 函数闭包操作一波
      closure(array,callback){
        for(let i =0; i < array.length; i++){
          array[i].addEventListener('afterhide',function fn(e){
            e.target.removeEventListener(e.type, fn);
            return callback(e);
          },false);
        }
      },
      // 只执行一次事件
      once(type, selector, callback) {
          selector.addEventListener(type, function fn(e) {
            e.target.removeEventListener(e.type, fn);
            return callback(e);
          }, false);
      },
      // 设置nav状态
      setAllNavState(state) {
        if (state !== 'show' && state !== 'hide') return;
        let isShow = state === 'show';
        let eventFix = isShow ? 'show' : 'hide';
        this.$refs.allNav.dispatchEvent(new Event('before' + eventFix));
        this.allnav_show = isShow;
        this.allnav_show = isShow;
        this.$refs.allNav.dispatchEvent(new Event('after' + eventFix));
      },
      // 设置层级导航显示隐藏状态
      setLevelnavState($el, state) {
        let setState = ($el, state) => {
          if (state !== 'show' && state !== 'hide') return;
          let duration = 300;
          let isShow = state === 'show';
          let eventFix = isShow ? 'show' : 'hide';
          $el.dispatchEvent(new Event('before' + eventFix));
          setTimeout(() => {
              if (true) {
                $el.dispatchEvent(new Event('after' + eventFix));
              }
          }, duration);
        };

        let setStateStrategy = {};
        setStateStrategy.show = () => {
          setState($el, 'show');
        };
        setStateStrategy.hide = () => {
          // 通过一个状态记录数据
          let model_list = []
          // 查询当前level 然后将之后level续的追加  成一个数组
          let item_model = $el;
          while (item_model) {
            model_list.push(item_model);
            item_model = item_model.nextElementSibling;
          }
          let $lastShowLevel = model_list[model_list.length - 1];
          let willHideNumber = model_list.length;
          setState($lastShowLevel, 'hide');
          this.closure(model_list,(e)=>{
            console.log('closure closure closure closure closure');
            willHideNumber--;
            if (willHideNumber <= 0) return;
            let target = e.target.previousElementSibling;
            if(target){
              setState(target, 'hide');
            }
          });
        };

        setStateStrategy[state]();

      },
      // 获取鼠标移动角度
      getMoveAngle() {
        var startPoint = this.mouseLocus[0],
          endPoint = this.mouseLocus[this.mouseLocus.length - 1];
        if (!startPoint) {
          return 0;
        }
        return utils.getDirectionAngle(startPoint.x, startPoint.y, endPoint.x, endPoint.y);
      },
      inDelayAngleRange_allnav($targetNav) {
        var moveAngle = this.getMoveAngle();
        var delayAngleRange = utils.getDelayAngleRange_allnav(this.mouseLocus[this.mouseLocus.length - 1].x, this
          .mouseLocus[this.mouseLocus
            .length - 1].y, $targetNav);
        // 如果鼠标移动目标为次级菜单则使用高延时反应时间
        return moveAngle <= delayAngleRange.max && moveAngle >= delayAngleRange.min;
      },

      addWrapperHover($event) {
        $event.currentTarget.className = "header-allnav-wrapper hover";
        var target = $event.target || $event.srcElement;
        if (target.parentNode.parentNode.parentNode.nodeName.toLowerCase() === 'ul') {
          target.parentNode.parentNode.parentNode.classList.add("hover");
        }

      },

      removeWrapperHover($event) {
        $event.currentTarget.className = "header-allnav-wrapper"
        // this.setLevelnavState(this.$refs.allnavLevel3, 'hide');
        // 鼠标移出导航(且未放在menu 上) 收起整个导航 否则收起 2级导航
        this.allNavDebounce(() => {
          let $allnavLevel = document.querySelectorAll(".header-allnav-level");
          let count = 0;
          $allnavLevel.forEach((item, index) => {
            if (item.className.indexOf('hover') !== -1) {
              count++;
            }
          });
          if (this.$refs.headerMenu.className.indexOf('hover') === -1 && count === 0) {
            this.setLevelnavState(this.$refs.allnavLevel1, 'hide');
          } else {
            this.setLevelnavState(this.$refs.allnavLevel2, 'hide');
          }
        });

      },

      removeWrapperhover_out($event) {
        var target = $event.target || $event.srcElement;
        if (target.parentNode.parentNode.parentNode.nodeName.toLowerCase() === 'ul') {
          target.parentNode.parentNode.parentNode.classList.remove("hover");
        }
        if (target.parentNode.nodeName.toLowerCase() === 'ul') {
          target.parentNode.classList.remove("hover");
        }
        if (target.className.indexOf("header-allnav-inner") !== -1) {
          this.menuDebounce(() => {
            if (target.parentNode.className.indexOf("hover") === -1) {
              this.setLevelnavState(target.parentNode, 'hide');
            }
          })
        }
      },

      addHover($event) {
        this.$refs.headerMenu.classList.add("hover");
        this.menuDebounce(() => {
          this.setAllNavState('show');
        });
      },
      removeHover($event) {
        $event.fromElement.classList.remove("hover");
        this.menuDebounce(() => {
          let name = "" + this.$refs.allNavWrapper.className;
          if (name !== "header-allnav-wrapper hover") {
            this.setLevelnavState(this.$refs.allnavLevel1, 'hide');
          }
        })
      },
      stateEvent(text, name, flag) {
        if (text !== "") {
          if (flag === "show") {
            this.$refs[text].children[0].classList.add("show");
            this.setLevelnavState(this.$refs[text], flag);
          } else {
            if (this.$refs[text].className.indexOf("hover") === -1) {
              this.$refs[text].children[0].classList.remove("show");
              this.setLevelnavState(this.$refs[text], flag);
            }
          }
        }
      },

    },
    destroyed: function () {
      window.removeEventListener('mousemove', function (e) {
        console.log("mousemove 销毁完成！！！");
      })
    }
  }

</script>

<style scoped>
  @import './css/global.css';
  @import './css/menu.css';
  @import './css/menu_level.css';

  .fade-enter-active {
    animation: bounce-in .5s;
  }

  .fade-leave-active {
    animation: bounce-in .5s reverse;
  }

  .fade-enter,
  .fade-leave-to {
    -ms-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    transition: 0.3s;
  }

  @keyframes bounce-in {
    0% {
      transform: translate3d(-100%, 0, 0);
    }

    100% {
      transform: translate3d(0%, 0, 0);
    }
  }

</style>
