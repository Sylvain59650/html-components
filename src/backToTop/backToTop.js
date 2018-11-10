import { createContext } from "vm";

/* global qsi newElement isDef */

export class BackToTop {
  constructor(config) {
    var ctx = this;
    this.config = Object.assign({ incY: 50, timer: 200, class: "backToTop" }, config);
    var style = Object.assign({ display: "none", bottom: "20px", right: "20px" }, this.config.style);
    this.container = newElement("div", { class: this.config.class }, "", { click: this.scrollToTop.bind(this, ctx) }, style);
    document.body.beforeEnd(this.container);
    window.on("scroll", this.shouldShowScroller.bind(this, ctx));
  }


  shouldShowScroller() {
    this.container.show(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20);
  }

  scrollUntilTop() {
    var ctx = this;
    var y = window.pageYOffset;
    window.scrollTo(0, y - ctx.config.incY);
    if (y > 0) {
      window.setTimeout(function() {
        ctx.scrollToTop.bind(ctx).call();
      }, ctx.config.timer);
    }
  }

  scrollToTop() {
    var ctx = this;
    if (ctx.config.timer === 0) {
      window.scrollTo(0, 0);
    } else {
      ctx.scrollUntilTop();
    }

  }

}