
#ifdef GL_ES
precision mediump float;
#endif


uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform vec3 rgb;
uniform float a;
uniform float t;
uniform float f;
uniform float f_add;


const int numOctaves = 10;

float noise( in vec2 p )
{
	return sin(p.x)*sin(p.y);
}

//fbm with a added with noise + multiplier
float fbm( in vec2 x, in float H)
{    
    float G = exp2(-H);
    float amplitude = a;
    float val = 0.0;
    float f = 100.0;
    float multiplier = 2.0;
    for( int i=0; i<numOctaves; i++ )
    {
        val += amplitude*noise(f*x);
        f += 0.6;
        amplitude *= multiplier*G;
    }
    return val;
}

//fbm with a added with noise + without gain multiplier
float fbm2( in vec2 x, in float H)
{    
    float G = exp2(-H);
    float amplitude = 1.0;
    float t = 0.0;
    float frequency = 100.0;
    float multiplier = 2.0;
    float lacunarity = 0.6;
    for( int i=0; i<numOctaves; i++ )
    {
        t += a*noise(frequency*x);
        frequency += 0.6;
        amplitude *= G;
    }
    return t;
}

//fbm with f multiplication
float fbm3( in vec2 x, in float H )
{    
    float G = exp2(-H);
    float f = 1.0;
    float a = 1.0;
    float t = 1.0;
    for( int i=0; i<numOctaves; i++ )
    {
        t += a*noise(f*x);
        f *= 0.1;
        a *= G;
    }
    return t;
}


//pattern2 addition
float pattern( in vec2 p, in float f )
{
    return fbm(p, f) + fbm(p, 1.0) ;
}

float pattern2( in vec2 p, in float f )
{
    return fbm(p, f);
}

float pattern3( in vec2 p, in float f )
{
    return  fbm(p, fbm(p, f));
}



void main (void) {
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy / resolution.xy;

    // constant pixel color
    vec3 col =  vec3(pattern(uv, rgb.x), pattern(uv, rgb.y), pattern(uv,rgb.z));
    //vec3 col =  0.5 + 0.5*cos(iTime+uv.xyx+vec3(pattern(fragCoord,0.7),pattern(fragCoord,0.7),0.5));
    //varying pixel color
    //vec3 col =  0.5 + 0.5*cos(uv.xyx+vec3(pattern(fragCoord,0.7),pattern(fragCoord,0.1),0.5));
    // Output to screen
    gl_FragColor = vec4(col, 1);
}
