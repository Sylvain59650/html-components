/* global qsi newElement isDef */

export class Select3 {
  constructor(config) {
    this.container = qsi(config.containerId);
    this.update(config);
  }


  update(config) {
    this.config = config;
    this.filteredData = config.data;
    var ctx = this;
    this.selected = newElement("div", { class: "select-box-selected" }, "", { click: this.toggleCollapse.bind(this, ctx) });
    this.container.beforeEnd(this.selected);
    if (this.config.allowClear) {
      this.cleaner = newElement("p", { class: "cleaner" }, "&#9747;", { click: this.clearSelected.bind(this, ctx) });
      this.container.beforeEnd(this.cleaner);
    }
    if (this.config.withSearch) {
      this.searcher = newElement("input", { type: "text", placeholder: "Search" }, "", { keyup: this.onSearch.bind(this, ctx) });
      this.container.beforeEnd(this.searcher);
    }

    this.items = newElement("div", { tabindex: 0, class: "select-box-items" }, "", { keydown: this.onkeydown.bind(this, ctx) });
    this.container.beforeEnd(this.items);
    this.container.addClass("select-box-values");

    this.selectedInput = newElement("input", { type: "text", name: config.containerId, value: this.val() });
    this.container.afterEnd(this.selectedInput);
    this.render();
  }


  render() {
    if (this.config.disabled) {
      this.selected.addClass("select-disabled");
      this.collapse();
    } else {
      this.selected.class("-select-disabled");
    }
    this.renderSelected();
    this.renderData();
  }


  renderSelected() {
    var st = this.displayLabels();
    if (st === "") {
      this.selected.innerText = this.config.placeholder;
      this.selected.class("select-novalue");
    } else {
      this.selected.innerText = st;
      this.selected.class("-select-novalue");
    }
    this.selectedInput.val(this.val());
  }


  displayLabels() {
    var label = this.filteredData.filter(x => x.selected === true).map(x => x.label).join(",");
    return label;
  }

  redraw() {
    this.filteredData = this.config.data;
    this.renderData();
    this.renderSelected();
  }

  clearSelected() {
    for (var i = 0; i < this.config.data.length; i++) {
      var it = this.config.data[i];
      if (!it.optgroup && !it.disabled && !it.locked) {
        this.config.data[i].selected = false;
      }
    }
    this.redraw();
  }

  inverseSelection() {
    for (var i = 0; i < this.config.data.length; i++) {
      var it = this.config.data[i];
      if (!it.optgroup && !it.disabled && !it.locked) {
        it.selected = !it.selected;
      }
    }
    this.redraw();
  }

  selectAll() {
    for (var i = 0; i < this.config.data.length; i++) {
      var it = this.config.data[i];
      if (!it.optgroup && !it.disabled && !it.locked) {
        it.selected = true;
      }
    }
    this.redraw();
  }


  renderData() {
    this.items.html("");
    var ctx = this;
    let index = 0;
    for (let option of this.filteredData) {
      this.renderOption(option, index, ctx);
    }
    this.container.css({ width: this.items.outerWidth() });
    var style = {};
    if (ctx.config.size) {
      style.height = "" + (Math.min(+ctx.config.size, ctx.filteredData.length) * 28) + "px";
      ctx.items.css(style);
    }
  }


  renderOption(option, index, ctx) {
    if (!option.optgroup) {
      var cl = "select-box-value";
      if (option.selected) { cl += " select-box-value-active"; }
      let item = newElement("div", { i: index, class: cl, value: option.value }, option.label);
      if (!option.disabled && !option.locked) {
        item.on("click", this.onClickValue.bind(this, ctx, item));
      }
      if (option.disabled) {
        item.class("select-box-disabled");
      }
      this.items.beforeEnd(item);
      index++;
    } else {
      let item = newElement("div", { class: "select-box-title" }, option.label);
      this.items.beforeEnd(item);
    }
  }


  onkeydown(ctx, ev) {
    console.log("key", ev.keyCode);
    if (ev.keyCode === 38 || ev.keyCode === 40) {
      let index = 0;
      let selected = this.items.qs(".select-box-value-active");
      if (selected == null) {
        selected = this.items.childNodes[0];
      }
      if (ev.keyCode === 40) { //down
        index = +selected.attr("i") + 1;
      } else if (ev.keyCode === 38) { //up
        index = +selected.attr("i") - 1;
        if (index < 0) { index = this.items.childNodes.length - 1; }
      }
      var newSelected = this.items.qs("[i='" + index + "']");
      if (newSelected == null) {
        newSelected = this.items.childNodes[0];
      }
      selected.class("-select-box-value-active");
      newSelected.class("select-box-value-active");
      if (newSelected.hasClass("select-box-disabled")) {
        this.onkeydown(ctx, ev);
      }
      //newSelected.scrollIntoView();
    } else if (ev.keyCode === 13) { //enter
      let selected = this.items.qs(".select-box-value-active");
      this.onClickValue(ctx, selected, ev);
    } else if (ev.keyCode === 65 && ev.ctrlKey && ctx.config.maximumSelectionLength !== 1) {
      ev.cancelBubble = true;
      ev.preventDefault();
      ev.stopImmediatePropagation();
      this.selectAll();
    } else if (ev.keyCode === 73 && ev.ctrlKey && ctx.config.maximumSelectionLength !== 1) {
      this.inverseSelection();
    }
  }


  onSearch(ctx, ev) {
    console.log(ev);
    var text = ctx.searcher.val();
    ctx.filteredData = ctx.config.data.filter(x => x.label.startsWith(text));
    ctx.renderData();
  }



  onClickValue(ctx, item, ev) {
    var val = item.val();
    var found = ctx.filteredData.find(x => x.value == val);
    found.selected = !found.selected;
    if (!ev.ctrlKey) {
      ctx.filteredData.filter(x => x !== found && x.selected === true).forEach(x => x.selected = false);
      ctx.items.childNodes.class("-select-box-value-active");
    }
    if (found.selected) {
      item.class("select-box-value-active");
    } else {
      item.class("-select-box-value-active");
    }
    if (!ctx.config.maximumSelectionLength === 1) {
      if (!found.selected) {
        item.removeClass("select-box-value-active");
      } else {
        item.addClass("select-box-value-active");
      }
    }
    this.renderSelected();
    if (ctx.closeOnSelect) {
      ctx.collapse();
    }

  }


  collapse() {
    this.items.show(false);
    if (isDef(this.searcher)) {
      this.searcher.show(false);
    }
  }


  uncollapse() {
    this.items.show();
    if (isDef(this.searcher)) {
      this.searcher.show(true);
    }
  }


  toggleCollapse() {
    if (!this.config.disabled) {
      this.items.toggleVisible();
      if (this.items.isVisible()) {
        this.items.focus();
        this.selected.class("select-box-selected-up");
      } else {
        this.selected.class("-select-box-selected-up");
      }
      if (isDef(this.searcher)) {
        this.searcher.toggleVisible();
        if (this.searcher.isVisible()) {
          this.searcher.focus();
        }
      }
    }
  }



  val(value) {
    if (arguments.length >= 1) {
      var found = this.items.find(x => x.val() === value);
      if (found) {
        found.addClass("select-box-value-active");
      } else {
        console.error("value " + value + " not found");
      }
    } else {
      var label = this.filteredData.filter(x => x.selected === true).map(x => x.value).join(",");
      return label;
    }
  }
}