function box(index, x, y, options) {
    this.content = options.content;
    this.height = options.height;
    this.index = index;
    this.x = x;
    this.y = y;
    this.r = Math.random() * 5 + 1;
    var alpha = (Math.floor(Math.random() * 10) + 1) / 10 / 2;
    this.color = "rgba(255,255,255," + alpha + ")";
}

box.prototype.draw = function() {
    this.content.fillStyle = this.color;
    this.content.shadowBlur = this.r * 2;
    this.content.beginPath();
    this.content.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
    this.content.closePath();
    this.content.fill();
};

box.prototype.move = function() {
    this.y -= 0.30;   //  上升移动速度
    if (this.y <= -10) {
        this.y = this.height + 10;
    }
    this.draw();
};

export {box};
