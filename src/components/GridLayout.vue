<template>
<div class="cardContainer">
  <div class="infoCard" :style="{width: (Width*InfoCellSize)+'%', height:Height+'px'}">
    <div class="content">
      <slot></slot>
    </div>
  </div>
  <div class="card" v-for="card in Cards" :key="card.name" :style="{width:Width+'%', height:Height+'px', display:'none', opacity:0}">
    <div class="content" @mouseover="mouseOverCard(card.Index)" @mouseleave="mouseLeaveCard(card.Index)">
      <div class="title">
        <h3>{{card.name}}</h3>
      </div>
      <div class="imgPlaceHolder" @click="clickCard(card.Index, card.images)">
        <div class="img" :style="{'background-image': card.defaultImage}">
        </div>
      </div>
    </div>
  </div>

  <!-- Root element of PhotoSwipe. Must have class pswp. -->
  <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">

    <!-- Background of PhotoSwipe.
           It's a separate element as animating opacity is faster than rgba(). -->
    <div class="pswp__bg"></div>

    <!-- Slides wrapper with overflow:hidden. -->
    <div class="pswp__scroll-wrap">

      <!-- Container that holds slides.
              PhotoSwipe keeps only 3 of them in the DOM to save memory.
              Don't modify these 3 pswp__item elements, data is added later on. -->
      <div class="pswp__container">
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
        <div class="pswp__item"></div>
      </div>

      <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
      <div class="pswp__ui pswp__ui--hidden">

        <div class="pswp__top-bar">

          <!--  Controls are self-explanatory. Order can be changed. -->

          <div class="pswp__counter"></div>

          <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>

          <button class="pswp__button pswp__button--share" title="Share"></button>

          <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>

          <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>

          <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
          <!-- element will get class pswp__preloader--active when preloader is running -->
          <div class="pswp__preloader">
            <div class="pswp__preloader__icn">
              <div class="pswp__preloader__cut">
                <div class="pswp__preloader__donut"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
          <div class="pswp__share-tooltip"></div>
        </div>

        <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
              </button>

        <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
              </button>

        <div class="pswp__caption">
          <div class="pswp__caption__center"></div>
        </div>

      </div>

    </div>

  </div>
</div>
</template>

<script>
import _ from 'underscore';
import Velocity from 'velocity';
import 'libs/velocity.ui';

import PhotoSwipe from 'photoswipe/dist/photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';

export default {
  name: 'grid-layout',
  props: {
    Items: {
      type: Array,
      required: true
    },
    ColumnsPerRow: {
      type: Number,
      default: 2
    },
    Filter: {
      type: Array,
      defult: () => []
    },
    InfoCellSize: {
      type: Number,
      default: 1
    },
    Height: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      $Cards: undefined,
      $Pswp: undefined,
      plainCards: undefined
    }
  },
  computed: {
    Cards() {
      // let items = this.Filter.length == 0 ?
      //   this.Items :
      //   this.Items.filter(i => _.intersection(i.tags, this.Filter).length > 0);
      let items = this.Items.map((i, index) => {
        i.Index = index;
        i.Visible = this.Filter.length == 0 ? true : _.intersection(i.tags, this.Filter).length > 0;
        return i
      })

      _.each(items.filter(i => i.Visible), (c, i) => {
        let index = i + this.InfoCellSize;
        c.Top = `${parseInt(index / this.ColumnsPerRow) * this.Height}px`;
        c.Left = `${(index%this.ColumnsPerRow) * this.Width}%`;
      })

      this.cacheCards(items);
      return items;
    },
    Width() {
      return 100 / this.ColumnsPerRow;
    }
  },
  watch: {
    plainCards(newValue, oldValue) {
      if (!oldValue) {
        return;
      }
      for (var i = 0; i < newValue.length; i++) {
        if (newValue[i].Visible) { //Visible just move it
          Velocity(this.$Cards[i], 'finish');
          Velocity(this.$Cards[i], {
            top: [newValue[i].Top, oldValue[i].Top],
            left: [newValue[i].Left, oldValue[i].Left],
          });
        }

        if (!newValue[i].Visible && oldValue[i].Visible) { //Hiding
          Velocity(this.$Cards[i], 'finish');
          Velocity(this.$Cards[i], 'transition.slideUpBigOut', 300);
        } else if (newValue[i].Visible && !oldValue[i].Visible) { //showing
          Velocity(this.$Cards[i], 'finish');
          Velocity(this.$Cards[i], 'transition.slideDownBigIn', 300);
        }
      }

    }

  },
  methods: {
    cacheCards(cards) {
      this.plainCards = cards.map(c => ({
        Left: c.Left,
        Top: c.Top,
        Visible: c.Visible
      }))
    },
    mouseOverCard(index) {
      let img = this.$Cards[index].getElementsByClassName('img');
      Velocity(img, 'stop');
      Velocity(img, {
        scale: 1.5
      }, 200);
    },
    mouseLeaveCard(index) {
      let img = this.$Cards[index].getElementsByClassName('img');
      Velocity(img, 'stop');
      Velocity(img, {
        scale: 1
      }, 200);
    },
    clickCard(index, images) {
      // build items array
      let items = images.map(i => ({
        src: i,
        msrc: i,
        w: 2012,
        h: 1530
      }));

      var thumbnail = this.$Cards[index].getElementsByClassName('imgPlaceHolder')[0], // find thumbnail
        pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
        rect = thumbnail.getBoundingClientRect();

      let options = {
        index: 0,
        //showAnimationDuration: 600,
        //hideAnimationDuration: 0,
        getThumbBoundsFn: () => {
          return {
            x: rect.left,
            y: rect.top + pageYScroll,
            w: rect.width
          };
        }
      };

      var gallery = new PhotoSwipe(this.$Pswp, PhotoSwipeUI_Default, items, options);
      gallery.init();
    }
  },
  mounted() {

    this.$Cards = document.getElementsByClassName('card');
    //this.$Cards.shift(); //Remove first card, this is info card
    this.$Pswp = document.getElementsByClassName('pswp')[0];

    window.setTimeout(() => {
      for (var i = 0; i < this.Cards.length; i++) {
        this.$Cards[i].style.top = this.plainCards[i].Top;
        this.$Cards[i].style.left = this.plainCards[i].Left;
      }

      Velocity(this.$Cards, 'transition.swoopIn', {
        duration: 300,
        stagger: 100
      });
    }, 50);

  }

}
</script>

<style lang="scss">
$card-padding: 5px;

.cardContainer {
    position: relative;
    width: 100%;
}

.card,
.infoCard {
    position: absolute;
    align-items: center;
    float: left;
    min-height: 1px;
    padding-left: 10px;
    padding-right: 10px;

    .content {
        position: relative;
        height: 100%;
        width: 100%;

        .title {
            position: absolute;
            left: $card-padding;
            right: $card-padding;
            top: $card-padding;

            h3 {
                text-align: center;
            }
        }

        .imgPlaceHolder {

            position: absolute;
            left: $card-padding;
            right: $card-padding;
            top: 60px;
            bottom: $card-padding;
            overflow: hidden;
            .img {
                background-position: 50% 50%;
                background-repeat: no-repeat;
                background-size: cover;
                width: 100%;
                height: 100%;
                cursor: pointer;
            }
        }
    }
}
//
// .card-enter,
// .card-leave-active {
//     opacity: 0;
//     transform: translateY(-90px);
// }

// .card-move {
//     transition: transform 0.6s;
// }
</style>
