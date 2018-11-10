/* global isDef qs qsi */

if (!isDef(ui)) { var ui = {} };


class Modal {

  constructor() {
    self = this;
    this.body = qs("body");
  }

  close(options) {
    qsi(options.id).css("display", "none");
    this.body.removeClass("body-fade");
  }


  show(options) {
    var text = "";
    var theModal = null;
    if (typeof options.content === "function") {
      text = options.content();
    } else {
      text = options.content;
    }
    var old = qsi(options.id);
    if (!isDef(old)) {
      var bar = newElement("div", { class: "modal-title" }, options.title);
      var btnClose = newElement("span", { class: "modal-close" }, "x");


      // bar.on("mousedown", function(e) {
      //   self.down = true;
      //   console.log(e);
      // });

      bar.on("mousemove", function(e) {
        if (e.buttons === 1) {
          console.log(e);
          theModal.css({ "left": e.clientX - e.offsetX - 1, "top": e.clientY - e.offsetY - 1 });
        }
      });

      // bar.on("mouseup", function(e) {
      //   debugger;
      //   self.down = false;
      // });
      theModal = newElement("div", { id: options.id, class: "modal" });
      theModal.beforeEnd(btnClose);

      var content = newElement("div", { class: "modal-content" }, text);


      theModal.afterBegin(bar);
      theModal.beforeEnd(content);
      if (isDef(options.buttonsBar)) {
        var footer = newElement("div", { class: "modal-footer" }, options.buttonsBar);
        theModal.beforeEnd(footer);
      }


      this.body.beforeEnd(theModal);
      this.body.on("keydown", function(e) { self.onkeydown(e, options) });
      this.body.attr("droppable", "true");

      btnClose.on("click", function() { self.close(options); });
    } else {
      theModal = old;
      theModal.qs(".modal-title").html(options.title);
      theModal.qs(".modal-content").html(text);
    }
    if (isDef(options.css)) {
      theModal.css(options.css);
    }
    theModal.css("display", "block");
    this.body.addClass("body-fade");
    return theModal;
  }



  onkeydown(e, options) {
    if (e.keyCode === 27) {
      self.close(options);
    }
  }

}