
#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;


const int numOctaves = 10;

float noise( in vec2 p )
{
	return sin(p.x)*sin(p.y);
}

float fbm( in vec2 x, in float H)
{    
    float G = exp2(-H);
    float a = 1.0;
    float t = 0.0;
    float f = 100.0;
    for( int i=0; i<numOctaves; i++ )
    {
        t += a*noise(f*x);
        f += 0.6;
        a *= 2.0*G;
    }
    return t;
}

float pattern( in vec2 p, in float f )
{
    return fbm(p, f) + fbm(p, 1.0) ;
}

void main (void) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // constant pixel color
    vec3 col =  vec3(pattern(uv,0.1), pattern(uv, 3.0), pattern(uv,1.0));

    // Output to screen
    gl_FragColor = vec4(col, 1);
}
