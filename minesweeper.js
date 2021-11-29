'use strict';
function Minesweeper(p, callback, error) {
  function reset(width) {
    $("#game-container, #game").width(width * (x * 16 + 20));
    $("#game").height(width * (y * 16 + 30 + 26 + 6));
  }
  function on(n) {
    return (n * x * 16 - 6 * Math.ceil(n * 13) - n * 2 * 6 - n * 26) / 2;
  }
  function setInterval() {
    return y + "_" + x + "_" + count;
  }
  function draw() {
    var startY;
    var i;
    var ctx = [];
    var x = on(input);
    ctx.push('<div class="bordertl"></div>');
    i = 0;
    for (; i < x; i++) {
      ctx.push('<div class="bordertb"></div>');
    }
    ctx.push('<div class="bordertr"></div>');
    ctx.push('<div class="borderlrlong"></div>', '<div class="time0" id="mines_hundreds"></div>', '<div class="time0" id="mines_tens"></div>', '<div class="time0" id="mines_ones"></div>', '<div class="facesmile" style="margin-left:', Math.floor(x), "px; margin-right: ", Math.ceil(x), 'px;" id="face"></div>', '<div class="time0" id="seconds_hundreds"></div>', '<div class="time0" id="seconds_tens"></div>', '<div class="time0" id="seconds_ones"></div>', '<div class="borderlrlong"></div>');
    ctx.push('<div class="borderjointl"></div>');
    i = 0;
    for (; i < x; i++) {
      ctx.push('<div class="bordertb"></div>');
    }
    ctx.push('<div class="borderjointr"></div>');
    startY = 1;
    for (; startY <= y; startY++) {
      ctx.push('<div class="borderlr"></div>');
      i = 1;
      for (; i <= x; i++) {
        ctx.push('<div class="square blank" id="', startY, "_", i, '"></div>');
      }
      ctx.push('<div class="borderlr"></div>');
    }
    ctx.push('<div class="borderbl"></div>');
    i = 0;
    for (; i < x; i++) {
      ctx.push('<div class="bordertb"></div>');
    }
    ctx.push('<div class="borderbr"></div>');
    i = 0;
    for (; i <= x + 1; i++) {
      ctx.push('<div class="square blank" style="display: none;" id="', 0, "_", i, '"></div>');
    }
    i = 0;
    for (; i <= x + 1; i++) {
      ctx.push('<div class="square blank" style="display: none;" id="', y + 1, "_", i, '"></div>');
    }
    startY = 1;
    for (; startY <= y; startY++) {
      ctx.push('<div class="square blank" style="display: none;" id="', startY, "_", 0, '"></div>');
      ctx.push('<div class="square blank" style="display: none;" id="', startY, "_", x + 1, '"></div>');
    }
    $("#game").html(ctx.join(""));
  }
  function constructor(row, col) {
    var key = 0;
    var targetOffsetHeight = false;
    var targetOffsetWidth = false;
    var data = false;
    this.addToValue = function(value) {
      key = key + value;
    };
    this.isMine = function() {
      return key < 0;
    };
    this.isFlagged = function() {
      return targetOffsetHeight;
    };
    this.isMarked = function() {
      return targetOffsetWidth;
    };
    this.isRevealed = function() {
      return data;
    };
    this.isHidden = function() {
      return row < 1 || row > y || col < 1 || col > x;
    };
    this.getRow = function() {
      return row;
    };
    this.getCol = function() {
      return col;
    };
    this.getValue = function() {
      return key;
    };
    this.setRevealed = function(remoteData) {
      data = remoteData;
    };
    this.plantMine = function() {
      key = key - 10;
      rooms[row - 1][col - 1].addToValue(1);
      rooms[row - 1][col].addToValue(1);
      rooms[row - 1][col + 1].addToValue(1);
      rooms[row][col - 1].addToValue(1);
      rooms[row][col + 1].addToValue(1);
      rooms[row + 1][col - 1].addToValue(1);
      rooms[row + 1][col].addToValue(1);
      rooms[row + 1][col + 1].addToValue(1);
    };
    this.unplantMine = function() {
      key = key + 10;
      rooms[row - 1][col - 1].addToValue(-1);
      rooms[row - 1][col].addToValue(-1);
      rooms[row - 1][col + 1].addToValue(-1);
      rooms[row][col - 1].addToValue(-1);
      rooms[row][col + 1].addToValue(-1);
      rooms[row + 1][col - 1].addToValue(-1);
      rooms[row + 1][col].addToValue(-1);
      rooms[row + 1][col + 1].addToValue(-1);
    };
    this.setClass = function(n) {
      document.getElementById(row + "_" + col).className = n;
    };
    this.reveal1 = function() {
      var roomKey;
      var af;
      var me;
      var item;
      var deadPool = [];
      deadPool.push(this);
      this.pushed = true;
      for (; deadPool.length > 0;) {
        me = deadPool.pop();
        if (!me.isRevealed() && !me.isFlagged()) {
          if (me.isMine()) {
            return false;
          } else {
            if (!me.isFlagged()) {
              me.setClass("square open" + me.getValue());
              me.setRevealed(true);
              if (!me.isHidden() && --workingBitsAvailable == 0) {
                onLoad();
                return true;
              }
              if (me.getValue() == 0 && !me.isHidden()) {
                roomKey = -1;
                for (; roomKey <= 1; roomKey++) {
                  af = -1;
                  for (; af <= 1; af++) {
                    item = rooms[me.getRow() + roomKey][me.getCol() + af];
                    if (!item.pushed && !item.isHidden() && !item.isRevealed()) {
                      deadPool.push(item);
                      item.pushed = true;
                    }
                  }
                }
              }
            }
          }
        }
      }
      start();
      return true;
    };
    this.reveal9 = function() {
      if (data) {
        var roomKey;
        var c;
        var neighbor;
        var oneKey = 0;
        var children = [];
        roomKey = -1;
        for (; roomKey <= 1; roomKey++) {
          c = -1;
          for (; c <= 1; c++) {
            neighbor = rooms[row + roomKey][col + c];
            if (neighbor != this && neighbor.isFlagged()) {
              oneKey++;
            }
          }
        }
        if (oneKey == key) {
          roomKey = -1;
          for (; roomKey <= 1; roomKey++) {
            c = -1;
            for (; c <= 1; c++) {
              neighbor = rooms[row + roomKey][col + c];
              if (neighbor != this && !neighbor.reveal1()) {
                children.push(neighbor);
              }
            }
          }
          if (children.length > 0) {
            set(children);
          } else {
            start();
          }
        }
      }
    };
    this.flag = function(flagged) {
      if (!data) {
        if (targetOffsetHeight) {
          if ($("#marks").attr("checked")) {
            this.setClass("square question");
            targetOffsetWidth = true;
          } else {
            this.setClass("square blank");
            if (flagged) {
              this._showFlagAnimation(true);
            }
          }
          targetOffsetHeight = false;
          skip++;
          add();
        } else {
          if (targetOffsetWidth) {
            this.setClass("square blank");
            targetOffsetWidth = false;
          } else {
            this.setClass("square bombflagged");
            targetOffsetHeight = true;
            skip--;
            add();
            if (flagged) {
              this._showFlagAnimation();
            }
          }
        }
        start();
      }
    };
    this._showFlagAnimation = function(zoomAware) {
      var pdfviewer = $("#" + row + "_" + col);
      var anchorBoundingBoxViewport = pdfviewer.offset();
      var star_left = anchorBoundingBoxViewport.left + pdfviewer.width() / 2;
      var loadingOffsetHeight = anchorBoundingBoxViewport.top + pdfviewer.height() / 2;
      var strip_width = 57 * input * 1.75;
      var new_height = 79 * input * 1.75;
      var style = {
        left : star_left - strip_width / 2,
        top : loadingOffsetHeight - new_height / 2,
        width : strip_width + "px",
        height : new_height + "px",
        opacity : 0
      };
      var oldStyle = {
        left : star_left,
        top : loadingOffsetHeight,
        width : 0,
        height : 0,
        opacity : 1
      };
      if (zoomAware) {
        var newStyle = style;
        style = oldStyle;
        oldStyle = newStyle;
      }
      var $slide = $('<img src="flag.png" class="flag-animation"></div>').css(style);
      $("body").append($slide);
      setTimeout(function() {
        $slide.css(oldStyle);
      }, 0);
      setTimeout(function() {
        $slide.remove();
      }, 500);
    };
    this.serializeToObj = function(array) {
      if (array) {
        if (!data && !targetOffsetHeight && !targetOffsetWidth) {
          return key;
        } else {
          return [key, data ? 1 : 0, targetOffsetHeight ? 1 : 0, targetOffsetWidth ? 1 : 0];
        }
      } else {
        return {
          value : key,
          isRevealed : data,
          isFlagged : targetOffsetHeight,
          isMarked : targetOffsetWidth
        };
      }
    };
    this.deserializeFromObj = function(target) {
      key = target.value;
      targetOffsetHeight = target.isFlagged;
      targetOffsetWidth = target.isMarked;
      data = target.isRevealed;
    };
  }
  function get(failure) {
    var i;
    var j;
    var x;
    var item;
    rooms = [];
    obj = [];
    data = [];
    x = 0;
    i = 0;
    for (; i <= y + 1; i++) {
      rooms[i] = [];
      j = 0;
      for (; j <= x + 1; j++) {
        item = new constructor(i, j);
        rooms[i][j] = item;
        obj[i + "_" + j] = item;
        if (!item.isHidden()) {
          data[x++] = item;
        }
      }
    }
    if (failure) {
      var result = failure.gridObj;
      i = 0;
      for (; i <= y + 1; i++) {
        j = 0;
        for (; j <= x + 1; j++) {
          rooms[i][j].deserializeFromObj(result[i][j]);
        }
      }
      data = [];
      i = 0;
      for (; i <= y + 1; i++) {
        j = 0;
        for (; j <= x + 1; j++) {
          item = rooms[i][j];
          if (!item.isHidden() && !item.isMine()) {
            data.push(item);
          }
        }
      }
    } else {
      x = 0;
      for (; x < count; x++) {
        data.splice(Math.floor(Math.random() * data.length), 1)[0].plantMine();
      }
    }
  }
  function prev(id) {
    var s = [];
    var i;
    var j;
    i = 0;
    for (; i <= y + 1; i++) {
      s[i] = [];
      j = 0;
      for (; j <= x + 1; j++) {
        s[i][j] = rooms[i][j].serializeToObj(id);
      }
    }
    return s;
  }
  function start() {
    var end = prev();
    level = {
      gridObj : end
    };
  }
  function remove(s) {
    var nm = s.getRow();
    var v = s.getCol();
    var roomKey;
    var 0101;
    var gen;
    var block;
    var table;
    if (!p && !parent) {
      if (s.isMine()) {
        data.splice(Math.floor(Math.random() * data.length), 1)[0].plantMine();
        s.unplantMine();
        data.push(s);
      }
      block = [];
      var i = 0;
      for (; i < data.length; i++) {
        table = data[i];
        if (table.getRow() < nm - 1 || table.getRow() > nm + 1 || table.getCol() < v - 1 || table.getCol() > v + 1) {
          block.push(table);
        }
      }
      roomKey = -1;
      for (; roomKey <= 1; roomKey++) {
        0101 = -1;
        for (; 0101 <= 1; 0101++) {
          gen = rooms[nm + roomKey][v + 0101];
          if (gen.isMine() && block.length > 0) {
            block.splice(Math.floor(Math.random() * block.length), 1)[0].plantMine();
            gen.unplantMine();
          }
        }
      }
    }
    player.start();
    if (nm == 1 && v == 1 || nm == 1 && v == x || nm == y && v == 1 || nm == y && v == x) {
      return 1;
    } else {
      if (nm == 1 || nm == y || v == 1 || v == x) {
        return 2;
      } else {
        return 3;
      }
    }
  }
  function save_multiple(value) {
    if (i > 0) {
      genRandomID();
      $.post("start.php", {
        key : id,
        s : value
      });
    }
  }
  function genRandomID() {
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var Z;
    id = "";
    Z = 0;
    for (; Z < 3; Z++) {
      id = id + possible.charAt(Math.floor(Math.random() * possible.length));
    }
    id = id + (4 * (Math.floor(Math.random() * 225) + 25) + i);
    Z = 0;
    for (; Z < 4; Z++) {
      id = id + possible.charAt(Math.floor(Math.random() * possible.length));
    }
  }
  function Player() {
    function loop() {
      var groupsize = (new Date).getTime();
      var timeValue = time * 1E3;
      var timeSubmittedDiff = groupsize - duedate;
      var checkInterval = 1E3 - (timeSubmittedDiff - timeValue);
      timer = setTimeout(loop, checkInterval);
      time++;
      reset();
    }
    function reset() {
      var m = check(time);
      document.getElementById("seconds_hundreds").className = "time" + m[0];
      document.getElementById("seconds_tens").className = "time" + m[1];
      document.getElementById("seconds_ones").className = "time" + m[2];
    }
    var duedate;
    var time;
    var timer;
    this.start = function() {
      duedate = (new Date).getTime() - time * 1E3;
      loop();
    };
    this.stop = function() {
      clearTimeout(timer);
    };
    this.getTime = function() {
      return time;
    };
    this.setTime = function(sec) {
      time = sec;
      reset();
    };
  }
  function add() {
    var result = check(skip);
    document.getElementById("mines_hundreds").className = "time" + result[0];
    document.getElementById("mines_tens").className = "time" + result[1];
    document.getElementById("mines_ones").className = "time" + result[2];
  }
  function check(a) {
    a = Math.min(a, 999);
    if (a >= 0) {
      return [Math.floor(a / 100), Math.floor(a % 100 / 10), a % 10];
    } else {
      return ["-", Math.floor(-a % 100 / 10), -a % 10];
    }
  }
  function set(array) {
    var min;
    var j;
    var i;
    var item;
    document.getElementById("face").className = "facedead";
    player.stop();
    rewrite = true;
    min = 1;
    for (; min <= y; min++) {
      j = 1;
      columnloop: for (; j <= x; j++) {
        item = rooms[min][j];
        if (!item.isRevealed()) {
          i = 0;
          for (; i < array.length; i++) {
            if (item == array[i]) {
              item.setClass("square bombdeath");
              continue columnloop;
            }
          }
          if (item.isMine() && !item.isFlagged()) {
            item.setClass("square bombrevealed");
          } else {
            if (!item.isMine() && item.isFlagged()) {
              item.setClass("square bombmisflagged");
            }
          }
        }
      }
    }
  }
  function onLoad() {
    var min;
    var j;
    var cell;
    var childKey;
    var eventHandler;
    var ac = false;
    document.getElementById("face").className = "facewin";
    player.stop();
    rewrite = true;
    skip = 0;
    add();
    min = 1;
    for (; min <= y; min++) {
      j = 1;
      for (; j <= x; j++) {
        cell = rooms[min][j];
        if (!cell.isRevealed() && !cell.isFlagged()) {
          cell.setClass("square bombflagged");
        }
      }
    }
    if (i > 0) {
      eventHandler = player.getTime();
      if (!p) {
        childKey = 3;
        for (; childKey >= 0; childKey--) {
          if (eventHandler <= p[childKey][i - 1]) {
            value(childKey + 1, true);
            ac = true;
            break;
          }
        }
        if (!ac && (i == 1 && eventHandler <= 10 || i == 2 && eventHandler <= 50 || i == 3 && eventHandler <= 150)) {
          value(1, false);
        }
      }
      if (instance.onWin) {
        instance.onWin(i, eventHandler);
      }
    }
  }
  function value(size, force) {
    var item;
    var path;
    var url;
    var aa = (new Date).getTime();
    var fun_stack;
    switch(size) {
      case 1:
        item = "daily";
        break;
      case 2:
        item = "weekly";
        break;
      case 3:
        item = "monthly";
        break;
      case 4:
        item = "all-time";
        break;
      default:
        item = "";
        break;
    }
    url = supports_local_storage() && !!localStorage.name ? localStorage.name : "";
    if (force) {
      path = prompt(player.getTime() + " is a new " + item + " high score! Please enter your name", url);
    } else {
      path = prompt("Please enter your name to submit your score (" + player.getTime() + ")", url);
    }
    path = $.trim(path).substring(0, 25);
    if (path && supports_local_storage()) {
      localStorage.name = path;
    }
    fun_stack = Math.round(((new Date).getTime() - aa) / 1E3);
    $.post("win.php", {
      key : id,
      name : path,
      time : player.getTime(),
      s : fun_stack,
      i : size,
      h : force ? 1 : 0
    }, function(canCreateDiscussions) {
      if (force && instance.onNewHighScore) {
        instance.onNewHighScore(size);
      }
    });
  }
  function supports_local_storage() {
    try {
      return "localStorage" in window && window.localStorage !== null;
    } catch (Y) {
      return false;
    }
  }
  function callback(marker) {
    return marker.className.substring(0, 6) == "square";
  }
  function f(m) {
    var b = {};
    if (columnWidth) {
      b.left = m.button == 1 || m.button == 3 || m.button == 4;
      b.right = m.button == 2 || m.button == 3 || m.button == 4;
    } else {
      b.left = m.button == 0 || m.button == 1;
      b.right = m.button == 2 || m.button == 1;
    }
    return b;
  }
  function fn(options, e, node) {
    if (!options.isRevealed()) {
      if (options.isMarked()) {
        options.setClass(node);
      } else {
        if (!options.isFlagged()) {
          options.setClass(e);
        }
      }
    }
  }
  function run(model, params, cache) {
    var roomKey;
    var Z;
    roomKey = -1;
    for (; roomKey <= 1; roomKey++) {
      Z = -1;
      for (; Z <= 1; Z++) {
        fn(rooms[model.getRow() + roomKey][model.getCol() + Z], params, cache);
      }
    }
  }
  function init() {
    function handler(event) {
      if (event.type === "touchmove" && !copyEventSimple(event)) {
        return;
      }
      var a = get(event);
      if (a != x && !companyId) {
        if (now) {
          if (x) {
            run(obj[x.id], "square blank", "square question");
          }
          if (callback(a)) {
            run(obj[a.id], "square open0", "square questionpressed");
          }
        } else {
          if (x) {
            fn(obj[x.id], "square blank", "square question");
          }
          if (callback(a)) {
            fn(obj[a.id], "square open0", "square questionpressed");
          }
        }
      }
      x = callback(a) ? a : undefined;
    }
    function onLoad(event) {
      if (event.type === "touchmove" && !copyEventSimple(event)) {
        return;
      }
      var m = get(event);
      document.getElementById("face").className = m.id == "face" ? "facepressed" : "facesmile";
    }
    function get(event) {
      if (event.type === "touchmove" || event.type === "touchend") {
        var touch = event.originalEvent.changedTouches[0];
        return document.elementFromPoint(touch.clientX, touch.clientY);
      } else {
        return event.target;
      }
    }
    function copyEventSimple(ev) {
      if (!identifier) {
        return false;
      }
      var 0 = ev.originalEvent.changedTouches[0].identifier === identifier;
      return 0;
    }
    function render() {
      if (!identifier) {
        return;
      }
      identifier = null;
      if (x) {
        fn(obj[x.id], "square blank", "square question");
        x = undefined;
      }
      if (!rewrite) {
        document.getElementById("face").className = "facesmile";
      }
    }
    var rePrase = false;
    var x;
    columnWidth = $.browser.msie && parseFloat($.browser.version) <= 7;
    $(document).bind("gesturestart", function(canCreateDiscussions) {
      new_tab = true;
      render();
    });
    $(document).bind("gestureend", function(canCreateDiscussions) {
      new_tab = false;
    });
    $(document).bind("scroll", render);
    $(document).bind("touchstart", function(e) {
      $(document).unbind("mousedown").unbind("mouseup");
      if (identifier || new_tab) {
        return;
      }
      identifier = e.originalEvent.changedTouches[0].identifier;
      if (callback(e.target) && !rewrite) {
        var u = identifier;
        var v = e.target;
        setTimeout(function() {
          if (u === identifier && v === x) {
            obj[v.id].flag(true);
            identifier = null;
            document.getElementById("face").className = "facesmile";
          }
        }, 500);
        $(document).bind("touchmove", handler);
        document.getElementById("face").className = "faceooh";
        x = undefined;
        handler(e);
      } else {
        if (e.target.id == "face") {
          rePrase = true;
          $(document).bind("touchmove", handler);
          document.getElementById("face").className = "facepressed";
        }
      }
    });
    $(document).bind("touchend", function(ev) {
      if (!copyEventSimple(ev)) {
        return;
      }
      identifier = null;
      $(document).unbind("touchmove", handler).unbind("touchmove", onLoad);
      if (rePrase || !rewrite) {
        document.getElementById("face").className = "facesmile";
      }
      var m = get(ev);
      if (callback(m) && !rewrite) {
        square = obj[m.id];
        if (!g) {
          squareTypeId = remove(square);
        }
        if (square.isRevealed()) {
          square.reveal9();
        } else {
          if (square.isFlagged()) {
            square.flag(true);
          } else {
            if (!square.reveal1()) {
              set([square]);
            }
            if (!g) {
              save_multiple(squareTypeId);
              g = true;
            }
          }
        }
        ev.preventDefault();
      } else {
        if (m.id == "face" && rePrase) {
          instance.newGame();
        }
      }
      rePrase = false;
    });
    $(document).mousedown(function(e) {
      var offset = f(e);
      padding = offset.left || padding;
      now = offset.right || now;
      if (e.ctrlKey && callback(e.target) && !rewrite) {
        obj[e.target.id].flag();
        isMouseDownForCtrlClick = true;
      } else {
        if (padding) {
          if (callback(e.target) && !rewrite) {
            e.preventDefault();
            $(document).bind("mousemove", handler);
            document.getElementById("face").className = "faceooh";
            x = undefined;
            handler(e);
          } else {
            if (e.target.id == "face") {
              e.preventDefault();
              rePrase = true;
              $(document).bind("mousemove", onLoad);
              document.getElementById("face").className = "facepressed";
            }
          }
        } else {
          if (now) {
            if (callback(e.target) && !rewrite) {
              obj[e.target.id].flag();
            }
            return false;
          }
        }
      }
    });
    $(document).on("contextmenu", function(jEvent) {
      var user = $(jEvent.target);
      if (user.is("#game") || user.closest("#game").length > 0) {
        return;
      }
      now = false;
    });
    $(document).mouseup(function(param) {
      var value = f(param);
      var key;
      var command;
      if (isMouseDownForCtrlClick) {
        padding = false;
        now = false;
        isMouseDownForCtrlClick = false;
        return;
      }
      if (value.left) {
        padding = false;
        $(document).unbind("mousemove", handler).unbind("mousemove", onLoad);
        if (rePrase || !rewrite) {
          document.getElementById("face").className = "facesmile";
        }
        if (callback(param.target) && !rewrite) {
          key = obj[param.target.id];
          if (now) {
            companyId = true;
            run(obj[param.target.id], "square blank", "square question");
            key.reveal9();
          } else {
            if (!companyId) {
              if (!g) {
                command = remove(key);
              }
              if (!key.reveal1()) {
                set([key]);
              }
              if (!g) {
                save_multiple(command);
                g = true;
              }
            }
            companyId = false;
          }
        } else {
          if (param.target.id == "face" && rePrase) {
            instance.newGame();
          }
        }
        rePrase = false;
      }
      if (value.right) {
        now = false;
        if (callback(param.target) && !rewrite) {
          if (padding) {
            key = obj[param.target.id];
            companyId = true;
            run(key, "square blank", "square question");
            key.reveal9();
          } else {
            companyId = false;
          }
          if (!rewrite) {
            document.getElementById("face").className = "facesmile";
          }
        }
      }
    });
    $(document).keydown(function(event) {
      function update() {
        var ah = window.navigator && window.navigator.platform && window.navigator.platform.toLowerCase().indexOf("mac") !== -1;
        if (ah) {
          return event.metaKey;
        } else {
          return event.ctrlKey;
        }
      }
      if (event.which == 113) {
        instance.newGame();
      } else {
        if (event.which == 32) {
          if (hoveredSquareId && !rewrite) {
            square = obj[hoveredSquareId];
            if (square.isRevealed()) {
              square.reveal9();
            } else {
              square.flag();
            }
          }
          event.preventDefault();
        } else {
          if (event.which == 90 && !event.shiftKey && update()) {
            if (document.getElementById("face").className == "facedead") {
              instance.newGame(level);
            }
          }
        }
      }
    });
    $("#game").mouseover(function(credential) {
      if (callback(credential.target)) {
        hoveredSquareId = credential.target.id;
      }
    });
    $("#game").mouseout(function(credential) {
      if (callback(credential.target)) {
        if (hoveredSquareId = credential.target.id) {
          hoveredSquareId = "";
        }
      }
    });
  }
  var instance = this;
  var i;
  var y;
  var x;
  var count;
  var input;
  var level;
  var p;
  var skip;
  var workingBitsAvailable;
  var rooms;
  var obj;
  var player = new Player;
  var rewrite;
  var g;
  var data;
  var id;
  var columnWidth;
  var companyId;
  var padding;
  var now;
  var identifier;
  var new_tab;
  var parent;
  init();
  this.newGame = function(key, data) {
    var j;
    var name;
    var self;
    var a;
    var isSupported;
    var args;
    a = setInterval();
    args = callback();
    i = args.gameTypeId;
    y = args.numRows;
    x = args.numCols;
    count = args.numMines;
    input = args.zoom;
    if (data) {
      if (typeof data.gameTypeId !== "undefined") {
        i = data.gameTypeId;
      }
      if (typeof data.numRows !== "undefined") {
        y = data.numRows;
      }
      if (typeof data.numCols !== "undefined") {
        x = data.numCols;
      }
      if (typeof data.numMines !== "undefined") {
        count = data.numMines;
      }
    }
    isSupported = setInterval() != a;
    reset(input);
    if (isSupported) {
      draw();
    }
    get(key);
    start();
    p = !!key;
    skip = count;
    workingBitsAvailable = y * x - count;
    j = 1;
    for (; j <= y; j++) {
      name = 1;
      for (; name <= x; name++) {
        self = rooms[j][name];
        if (self.isFlagged()) {
          self.setClass("square bombflagged");
          skip--;
        } else {
          if (self.isMarked()) {
            self.setClass("square question");
          } else {
            if (self.isRevealed()) {
              self.setClass("square open" + self.getValue());
              if (!self.isHidden()) {
                workingBitsAvailable--;
              }
            } else {
              self.setClass("square blank");
            }
          }
        }
      }
    }
    player.stop();
    if (!p) {
      player.setTime(0);
    } else {
      if (data && typeof data.time !== "undefined") {
        player.setTime(data.time);
      } else {
      }
    }
    add();
    rewrite = false;
    g = false;
    companyId = false;
    padding = false;
    now = false;
    isMouseDownForCtrlClick = false;
    identifier = null;
    new_tab = false;
    parent = false;
    $("#face")[0].className = "facesmile";
    hoveredSquareId = "";
  };
  this.resize = function(name) {
    var e = on(name);
    reset(name);
    $("#game-container").removeClass("z" + input * 100).addClass("z" + name * 100);
    $("#face").css({
      "margin-left" : Math.floor(e) + "px",
      "margin-right" : Math.ceil(e) + "px"
    });
    input = name;
  };
  this.hasStartedPlaying = function() {
    return g;
  };
  this.export_ = function() {
    var end = prev(true);
    var BOUNCE_BACK = player.getTime();
    var data = {
      version : 1,
      gameTypeId : i,
      numRows : y,
      numCols : x,
      numMines : count,
      gridObj : end,
      time : BOUNCE_BACK
    };
    parent = true;
    return btoa(JSON.stringify(data));
  };
  this.isImportable = function(cloudSaveData) {
    try {
      var Riloadr = JSON.parse(atob(cloudSaveData));
      return Riloadr.version === 1;
    } catch (Z) {
      return false;
    }
  };
  this.import_ = function(cloudSaveData) {
    var settings = JSON.parse(atob(cloudSaveData));
    var pred;
    var agent;
    var result;
    var new_state;
    var b = [];
    pred = 0;
    for (; pred <= settings.numRows + 1; pred++) {
      b[pred] = [];
      agent = 0;
      for (; agent <= settings.numCols + 1; agent++) {
        result = settings.gridObj[pred][agent];
        if (typeof result === "number") {
          new_state = {
            value : result,
            isRevealed : false,
            isFlagged : false,
            isMarked : false
          };
        } else {
          new_state = {
            value : result[0],
            isRevealed : result[1] === 1,
            isFlagged : result[2] === 1,
            isMarked : result[3] === 1
          };
        }
        b[pred][agent] = new_state;
      }
    }
    var level = {
      gridObj : b
    };
    var message = {
      gameTypeId : settings.gameTypeId,
      numRows : settings.numRows,
      numCols : settings.numCols,
      numMines : settings.numMines,
      time : settings.time
    };
    error({
      gameTypeId : settings.gameTypeId,
      numRows : settings.numRows,
      numCols : settings.numCols,
      numMines : settings.numMines
    });
    instance.newGame(level, message);
  };
}
;