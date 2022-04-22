hsvar N = 80;
var iter = 4;
var SCALE = 10;

class Fluid {
  constructor(dt, diff, visc) {
    this.size = N;
    this.dt = dt;
    this.diff = diff;
    this.visc = visc;

    this.s = [];
    this.density = [];

    this.Vx = [];
    this.Vy = [];

    this.Vx0 = [];
    this.Vy0 = [];

    for(var i = 0; i < N; i++) {
      for(var j = 0; j < N; j++) {
        var idx = IX(i, j);
        this.s[idx] = 0;
        this.density[idx] = 0;

        this.Vx[idx] = 0;
        this.Vy[idx] = 0;

        this.Vx0[idx] = 0;
        this.Vy0[idx] = 0;
      }
    }
  }

  step(){
    var visca     = this.visc;
    var diffa     = this.diff;
    var dta       = this.dt;
    var Vxa      = this.Vx;
    var Vya      = this.Vy;
    var Vx0a     = this.Vx0;
    var Vy0a     = this.Vy0;
    var sa       = this.s;
    var densitya = this.density;

    diffuse(1, Vx0a, Vxa, visca, dta);
    diffuse(2, Vy0a, Vya, visca, dta);

    project(Vx0a, Vy0a, Vxa, Vya);

    advect(1, Vxa, Vx0a, Vx0a, Vy0a, dta);
    advect(2, Vya, Vy0a, Vx0a, Vy0a, dta);

    project(Vxa, Vya, Vx0a, Vy0a);

    diffuse(0, sa, densitya, diffa, dta);
    advect(0, densitya, sa, Vxa, Vya, dta);
  }

  renderD() {
    for(var i = 0; i < N; i++) {
      for(var j = 0; j < N; j++) {
        var x = i * SCALE;
        var y = j * SCALE;
        var d = this.density[IX(i, j)];
        //fill(d, 100, 100, 1);
        fill(d,d,d,1);
        noStroke();
        square(x, y, SCALE);
      }
    }
  }

  addDensity(x, y, amt) {
    var idx = IX(x, y);
    this.density[idx] += amt;
  }

  addVelocity(x, y, amtX, amtY) {
    var idx = IX(x, y);
    this.Vx[idx] += amtX;
    this.Vy[idx] += amtY;
  }
}

function set_bnd(b, x) {
  for(var i = 1; i < N - 1; i++) {
    x[IX(i, 0  )] = b == 2 ? -x[IX(i, 1  )] : x[IX(i, 1  )];
    x[IX(i, N-1)] = b == 2 ? -x[IX(i, N-2)] : x[IX(i, N-2)];
  }

  for(var j = 1; j < N - 1; j++) {
    x[IX(0  , j)] = b == 1 ? -x[IX(1  , j)] : x[IX(1  , j)];
    x[IX(N-1, j)] = b == 1 ? -x[IX(N-2, j)] : x[IX(N-2, j)];
  }

  x[IX(0, 0)]       = 0.33 * (x[IX(1, 0)] + x[IX(0, 1)]);
  x[IX(0, N-1)]     = 0.33 * (x[IX(1, N-1)] + x[IX(0, N-2)]);
  x[IX(N-1, N-1)]   = 0.33 * (x[IX(N-2, N-1)] + x[IX(N-1, N-2)]);
  x[IX(N-1, 0)]     = 0.33 * (x[IX(N-2, 0)] + x[IX(N-1, 1)]);

}

function lin_solve(b, x, x0, a, c) {
  var cRecip = 1.0 / c;
  for (var k = 0; k < iter; k++) {
    for (var j = 1; j < N - 1; j++) {
      for (var i = 1; i < N - 1; i++) {
                    x[IX(i, j)] =
                        (x0[IX(i, j)]
                            + a*(    x[IX(i+1, j  )]
                                    +x[IX(i-1, j  )]
                                    +x[IX(i  , j+1)]
                                    +x[IX(i  , j-1)]
                           )) * cRecip;
      }
    }
    set_bnd(b, x);
  }
}

function diffuse(b, x, x0, diff, dt) {
  var a = dt * diff * (N - 2) * (N - 2);
  lin_solve(b, x, x0, a, 1 + 6 * a);
}

function project(velocX, velocY, p, div) {
  for (var j = 1; j < N - 1; j++) {
    for (var i = 1; i < N - 1; i++) {
      div[IX(i, j)] = -0.5*(
                 velocX[IX(i+1, j  )]
                -velocX[IX(i-1, j  )]
                +velocY[IX(i  , j+1)]
                -velocY[IX(i  , j-1)]
                )/N;
      p[IX(i, j)] = 0;
    }
  }

  set_bnd(0, div);
  set_bnd(0, p);
  lin_solve(0, p, div, 1, 6);

  for (var j = 1; j < N - 1; j++) {
    for (var i = 1; i < N - 1; i++) {
      velocX[IX(i, j)] -= 0.5 * (  p[IX(i+1, j)] - p[IX(i-1, j)] ) * N;
      velocY[IX(i, j)] -= 0.5 * (  p[IX(i, j+1)] - p[IX(i, j-1)] ) * N;
    }
  }

  set_bnd(1, velocX);
  set_bnd(2, velocY);
}

function advect(b, d, d0, velocX, velocY, dt) {
  var i0, i1, j0, j1;

  var dtx = dt * (N - 2);
  var dty = dt * (N - 2);

  var s0, s1, t0, t1;
  var tmp1, tmp2, x, y;

  var Nfloat = N;
  var ifloat, jfloat;
  var i, j;


  for(j = 1, jfloat = 1; j < N - 1; j++, jfloat++) {
    for(i = 1, ifloat = 1; i < N - 1; i++, ifloat++) {
      tmp1 = dtx * velocX[IX(i, j)];
      tmp2 = dty * velocY[IX(i, j)];
      x    = ifloat - tmp1;
      y    = jfloat - tmp2;

      if(x < 0.5) x = 0.5;
      if(x > Nfloat + 0.5) x = Nfloat + 0.5;
      i0 = floor(x);
      i1 = i0 + 1.0;
      if(y < 0.5) y = 0.5;
      if(y > Nfloat + 0.5) y = Nfloat + 0.5;
      j0 = floor(y);
      j1 = j0 + 1.0;

      s1 = x - i0;
      s0 = 1.0 - s1;
      t1 = y - j0;
      t0 = 1.0 - t1;

      var i0i = i0;
      var i1i = i1;
      var j0i = j0;
      var j1i = j1;

      d[IX(i, j)] =

          s0 * ( t0 * d0[IX(i0i, j0i)]
              +( t1 * d0[IX(i0i, j1i)]))
         +s1 * ( t0 * d0[IX(i1i, j0i)]
              +( t1 * d0[IX(i1i, j1i)]));
    }
  }

  set_bnd(b, d);
}

function IX(x, y) {
  x = constrain(x, 0, N-1);
  y = constrain(y, 0, N-1);
  return x + y * N;
}
