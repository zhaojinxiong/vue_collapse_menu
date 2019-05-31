export default {
  debounce: function (defaultTime) {
    var timeoutIndex;
    return function (callback, time) {
      if (typeof time !== 'number') {
        time = defaultTime;
      }
      if (typeof timeoutIndex === 'number') {
        clearTimeout(timeoutIndex);
      }

      timeoutIndex = setTimeout(callback, time);
    };
  },
  transitionEnd: function () {
    var el = document.createElement('div');
    var transEndEventNames = {
      transition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'transitionend',
      OTransition: 'oTransitionEnd otransitionend',
    };

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        console.log('transitionEnd', transEndEventNames[name]);
        return transEndEventNames[name];
      }
    }
    return false;
  }(),

  // 获取方向角
  getDirectionAngle: function (startX, startY, endX, endY) {
    var diffY = endY - startY,
      diffX = endX - startX,
      angle = Math.atan(diffY / diffX) / Math.PI * 180;

    if (diffX < 0 && diffY > 0) {
      angle = 180 + angle;
    } else if (diffX < 0 && diffY < 0) {
      angle = angle - 180;
    }

    return angle;
  },
  // 获取allnav 导航需要延时的角度范围
  getDelayAngleRange_allnav: function (startX, startY, $targetNav) {
    if (!$targetNav.is(':visible')) {
      return {
        min: 0,
        max: 0,
      };
    }

    var margin = 30, // 次级菜单边界安全裕量
      navOffset = $targetNav.offset(),
      navHeight = $targetNav.outerHeight(),
      left = navOffset.left,
      top = navOffset.top - margin,
      bottom = navOffset.top + navHeight + margin,
      leftTopPoint = {
        x: left,
        y: top,
      },
      leftBottomPoint = {
        x: left,
        y: bottom,
      },
      directionAngle_leftTop = getDirectionAngle(startX, startY, leftTopPoint.x, leftTopPoint.y),
      directionAngle_leftBottom = getDirectionAngle(startX, startY, leftBottomPoint.x, leftBottomPoint.y);

    return {
      min: directionAngle_leftTop,
      max: directionAngle_leftBottom,
    };
  },

  // 


}
