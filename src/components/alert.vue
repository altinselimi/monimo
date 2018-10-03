<style lang="scss">
$red: #FE4A49;
$blue: #19a7f3;
$green: #61D095;
$sun: #FDB833;

#alert {
  display: flex;
  min-width: 350px;
  position: fixed;
  top: 90px;
  right: 10px;
  max-width: 350px;
  align-items: stretch;
  border-radius: 4px;
  background-color: white;
  font-size: 12pt;
  box-shadow: 0px 2px 6px -3px rgba(black, .45);
  z-index: 20;
  box-sizing: border-box;
  transition: transform linear .5s;
  .content,
  .icon {
    padding-top: 15px;
    padding-bottom: 15px;
    align-self: center;
  }
  .content {
    margin-right: 4px;
  }

  .buttons {
    list-style: none;
    margin: 0px;
    padding: 0px;
    margin-left: auto;
    display: inline-flex;
    flex-direction: column;
    border-left: solid 1px rgba(black, .08);
    button {
      flex: 1;
      font-size: 11pt;
      padding: 5px 10px;
      &:nth-child(2) {
        border-top: solid 1px rgba(black, .08);
      }
    }
    button {
      cursor: pointer;
      outline: none;
      border: none;
      background: transparent;
      opacity: .8;
      &:hover, :active{
        opacity: 1;
      }
    }
  }
  .icon {
    display: flex;
    padding-left: 15px;
    svg {
      width: 20px;
      height: 20px;
      margin-right: 10px;
    }
  }
  &.info {
    border-top: solid 2px $blue;
  }
  &.info .icon {
    color: $blue;
    svg {
      stroke: $blue;
    }
  }
  &.alert {
    border-top: solid 2px $red;
  }
  &.alert .icon {
    color: $red;
    svg {
      stroke: $red;
    }
  }
}

.swing-enter-active,
.swing-leave-active {}

.swing-enter {
  transform: translateX(350px);
}

.swing-enter-to {
  transform: translateX(0px);
}

.swing-leave {
  transform: translateX(0px);
}

.swing-leave-to {
  transform: translateX(350px);
}
</style>
<template>
  <transition name="swing">
    <div id="alert" :class="type" v-if="visibility">
      <div class="icon">
        <slot name="icon">
          <alert-icon v-if="type === 'alert'"></alert-icon>
          <info-icon v-else></info-icon>
        </slot>
      </div>
      <div class="content">
        <slot>Alert component is ready!</slot>
      </div>

      <slot name="buttons">
        <div class="buttons">
          <button>Now</button>
          <button>Later</button>
        </div>
      </slot>
    </div>
  </transition>
</template>
<script>
/* ============
 * Alert Component
 * ============
 *
 * todo: add documentation here!
 */
import { AlertTriangleIcon, InfoIcon } from 'vue-feather-icons';

export default {
  components: {
    alertIcon: AlertTriangleIcon,
    InfoIcon,
  },
  props: {
    visibility: Boolean,
    persistent: {
      default: false,
      type: Boolean,
    },
    type: {
      required: false,
      default: 'info',
    },
    duration: {
      default: 5,
    },
  },
  watch: {
    visibility(val) {
      if (!val || this.persistent) return;
      let timeout = setTimeout(() => {
        this.$emit('update:visibility', false);
        clearTimeout(timeout);
      }, this.duration * 1000);
    },
  },
};
</script>