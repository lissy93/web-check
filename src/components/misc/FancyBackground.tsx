import { useEffect, useMemo } from "react";


const FancyBackground = (): JSX.Element => {
  
  const makeAbsolute = (elem: HTMLElement) => {
    elem.style.position = 'absolute';
    elem.style.top = '0';
    elem.style.left = '0';
  };

  const maxBy = (array: any) => {
    const chaos = 30;
    const iteratee = (e: any) => e.field + chaos * Math.random();
    let result;
    if (array == null) { return result; }
    let computed;
    for (const value of array) {
      const current = iteratee(value);
      if (current != null && (computed === undefined ? current : current > computed)) {
        computed = current;
        result = value;
      }
    }
    return result;
  };
  
  const App: any = useMemo(() => [], []);
  
  App.setup = function () {

    this.lifespan = 1000;
    this.popPerBirth = 1;
    this.maxPop = 300;
    this.birthFreq = 2;
    this.bgColor = '#141d2b';

    var canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.opacity = '0.5';
    makeAbsolute(canvas);
    this.canvas = canvas;
    const container = document.getElementById('fancy-background');
    if (container) {
      container.style.color = this.bgColor;
      makeAbsolute(container);
      container.appendChild(canvas);
    }
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.dataToImageRatio = 1;
    this.ctx.imageSmoothingEnabled = false;
    this.ctx.webkitImageSmoothingEnabled = false;
    this.ctx.msImageSmoothingEnabled = false;
    this.xC = this.width / 2;
    this.yC = this.height / 2;
  
    this.stepCount = 0;
    this.particles = [];

  
    // Build grid
    this.gridSize = 8; // Motion coords
    this.gridSteps = Math.floor(1000 / this.gridSize);
    this.grid = [];
    var i = 0;
    for (var xx = -500; xx < 500; xx += this.gridSize) {
      for (var yy = -500; yy < 500; yy += this.gridSize) {
        // Radial field, triangular function of r with max around r0
        var r = Math.sqrt(xx * xx + yy * yy),
          r0 = 100,
          field;
  
        if (r < r0) field = (255 / r0) * r;
        else if (r > r0) field = 255 - Math.min(255, (r - r0) / 2);
  
        this.grid.push({
          x: xx,
          y: yy,
          busyAge: 0,
          spotIndex: i,
          isEdge:
            xx === -500
              ? 'left'
              : xx === -500 + this.gridSize * (this.gridSteps - 1)
              ? 'right'
              : yy === -500
              ? 'top'
              : yy === -500 + this.gridSize * (this.gridSteps - 1)
              ? 'bottom'
              : false,
          field: field,
        });
        i++;
      }
    }
    this.gridMaxIndex = i;
  
    // Counters for UI
    this.drawnInLastFrame = 0;
    this.deathCount = 0;
  
    this.initDraw();
  };
  App.evolve = function () {
    var time1 = performance.now();
  
    this.stepCount++;
  
    // Increment all grid ages
    this.grid.forEach(function (e: any) {
      if (e.busyAge > 0) e.busyAge++;
    });
  
    if (
      this.stepCount % this.birthFreq === 0 &&
      this.particles.length + this.popPerBirth < this.maxPop
    ) {
      this.birth();
    }
    App.move();
    App.draw();
  
    var time2 = performance.now();
  
    // Update UI
    const elemDead = document.getElementsByClassName('dead');
    if (elemDead && elemDead.length > 0) elemDead[0].textContent = this.deathCount;

    const elemAlive = document.getElementsByClassName('alive');
    if (elemAlive && elemAlive.length > 0) elemAlive[0].textContent = this.particles.length;
    
    const elemFPS = document.getElementsByClassName('fps');
    if (elemFPS && elemFPS.length > 0) elemFPS[0].textContent = Math.round(1000 / (time2 - time1)).toString();
    
    const elemDrawn = document.getElementsByClassName('drawn');
    if (elemDrawn && elemDrawn.length > 0) elemDrawn[0].textContent = this.drawnInLastFrame;
  };
  App.birth = function () {
    var x, y;
    var gridSpotIndex = Math.floor(Math.random() * this.gridMaxIndex);
    var gridSpot = this.grid[gridSpotIndex];
    x = gridSpot.x;
    y = gridSpot.y;
  
    var particle = {
      hue: 200, // + Math.floor(50*Math.random()),
      sat: 95, //30 + Math.floor(70*Math.random()),
      lum: 20 + Math.floor(40 * Math.random()),
      x: x,
      y: y,
      xLast: x,
      yLast: y,
      xSpeed: 0,
      ySpeed: 0,
      age: 0,
      ageSinceStuck: 0,
      attractor: {
        oldIndex: gridSpotIndex,
        gridSpotIndex: gridSpotIndex, // Pop at random position on grid
      },
      name: 'seed-' + Math.ceil(10000000 * Math.random()),
    };
    this.particles.push(particle);
  };
  App.kill = function (particleName: any) {
    const newArray = this.particles.filter(
      (seed: any) => seed.name !== particleName
    );
    this.particles = [...newArray];
  };
  App.move = function () {
    for (var i = 0; i < this.particles.length; i++) {
      // Get particle
      var p = this.particles[i];
  
      // Save last position
      p.xLast = p.x;
      p.yLast = p.y;
  
      // Attractor and corresponding grid spot
      var index = p.attractor.gridSpotIndex,
        gridSpot = this.grid[index];
  
      // Maybe move attractor and with certain constraints
      if (Math.random() < 0.5) {
        // Move attractor
        if (!gridSpot.isEdge) {
          // Change particle's attractor grid spot and local move function's grid spot
          var topIndex = index - 1,
            bottomIndex = index + 1,
            leftIndex = index - this.gridSteps,
            rightIndex = index + this.gridSteps,
            topSpot = this.grid[topIndex],
            bottomSpot = this.grid[bottomIndex],
            leftSpot = this.grid[leftIndex],
            rightSpot = this.grid[rightIndex];
    
          var maxFieldSpot = maxBy(
            [topSpot, bottomSpot, leftSpot, rightSpot]
          );
  
          var potentialNewGridSpot = maxFieldSpot;
          if (
            potentialNewGridSpot.busyAge === 0 ||
            potentialNewGridSpot.busyAge > 15
          ) {
            p.ageSinceStuck = 0;
            p.attractor.oldIndex = index;
            p.attractor.gridSpotIndex = potentialNewGridSpot.spotIndex;
            gridSpot = potentialNewGridSpot;
            gridSpot.busyAge = 1;
          } else p.ageSinceStuck++;
        } else p.ageSinceStuck++;
  
        if (p.ageSinceStuck === 10) this.kill(p.name);
      }
  
      // Spring attractor to center with viscosity
      const k = 8, visc = 0.4;
      var dx = p.x - gridSpot.x,
        dy = p.y - gridSpot.y,
        dist = Math.sqrt(dx * dx + dy * dy);
  
      // Spring
      var xAcc = -k * dx,
        yAcc = -k * dy;
  
      p.xSpeed += xAcc;
      p.ySpeed += yAcc;
  
      // Calm the f*ck down
      p.xSpeed *= visc;
      p.ySpeed *= visc;
  
      // Store stuff in particle brain
      p.speed = Math.sqrt(p.xSpeed * p.xSpeed + p.ySpeed * p.ySpeed);
      p.dist = dist;
  
      // Update position
      p.x += 0.1 * p.xSpeed;
      p.y += 0.1 * p.ySpeed;
  
      // Get older
      p.age++;
  
      // Kill if too old
      if (p.age > this.lifespan) {
        this.kill(p.name);
        this.deathCount++;
      }
    }
  };
  App.initDraw = function () {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
  };
  App.draw = function () {
    this.drawnInLastFrame = 0;
    if (!this.particles.length) return false;
  
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.width, this.height);
    this.ctx.fillStyle = this.bgColor;
    this.ctx.fill();
    this.ctx.closePath();
  
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
  
      var last = this.dataXYtoCanvasXY(p.xLast, p.yLast),
        now = this.dataXYtoCanvasXY(p.x, p.y);
      var attracSpot = this.grid[p.attractor.gridSpotIndex],
        attracXY = this.dataXYtoCanvasXY(attracSpot.x, attracSpot.y);
      var oldAttracSpot = this.grid[p.attractor.oldIndex],
        oldAttracXY = this.dataXYtoCanvasXY(oldAttracSpot.x, oldAttracSpot.y);
  
      this.ctx.beginPath();
      this.ctx.strokeStyle = '#9fef00';
      this.ctx.fillStyle = '#9fef00';
  
      // Particle trail
      this.ctx.moveTo(last.x, last.y);
      this.ctx.lineTo(now.x, now.y);
  
      this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
      this.ctx.stroke();
      this.ctx.closePath();
  
      // Attractor positions
      this.ctx.beginPath();
      this.ctx.lineWidth = 1.5 * this.dataToImageRatio;
      this.ctx.moveTo(oldAttracXY.x, oldAttracXY.y);
      this.ctx.lineTo(attracXY.x, attracXY.y);
      this.ctx.arc(
        attracXY.x,
        attracXY.y,
        1.5 * this.dataToImageRatio,
        0,
        2 * Math.PI,
        false
      );

      this.ctx.strokeStyle = '#9fef00';
      this.ctx.fillStyle = '#9fef00';

      this.ctx.stroke();
      this.ctx.fill();
  
      this.ctx.closePath();
  
      // UI counter
      this.drawnInLastFrame++;
    }
  };
  App.dataXYtoCanvasXY = function (x: number, y: number) {
    var zoom = 1.6;
    var xx = this.xC + x * zoom * this.dataToImageRatio,
      yy = this.yC + y * zoom * this.dataToImageRatio;
  
    return { x: xx, y: yy };
  };
  
  useEffect(() => {
    App.setup();
    App.draw();
  
    var frame = function () {
      App.evolve();
      requestAnimationFrame(frame);
    };
    frame();
  }, [App]);
  
  

  return (
  <div className='ui' id='fancy-background'>
    <p><span className='dead'>0</span></p>
    <p><span className='alive'>0</span></p>
    <p><span className='drawn'>0</span></p>
    <p><span className='fps'>0</span></p>
  </div>
  );
}

export default FancyBackground;
