# Change log

## v0.0.0.1
* v0.0.0.1_b - Micro update, Added new features\
  Added: Simple Keyboard Input. Now you can use all 10 fingers for control some processes!
  Added: Special variables `u_KeyN` where `N` - is Number of key from 0 to 9: `u_Key0`, `u_Key1`, ... `u_Key7`, etc.\
  `u_KeyN` as `int`. For more information check [DOCS](docs/v0.0.0.1/v0.0.0.1_b.md)
* v0.0.0.1_a2 - Micro update, Fixed some bugs\
  Fixed: Clear console after shader compiling
* v0.0.0.1_a1 - Micro update, Fixed some bugs\
  Fixed: Get Uniform Location Error
* v0.0.0.1_a - Version update, Fixed some bugs\
  Fixed: Attach Shader Error

## v0.0.0.0
* v0.0.0.0_b2 - Micro update, Added some features\
  Added: Wheel input via Z-component of `u_MouseMove`. `u_MouseMove` is `vec3` now
* v0.0.0.0_b1 - Micro update, Added some features\
  Added: Mouse input via `u_MouseKeys`. Now you can do something operations like move, rotate etc.
* v0.0.0.0_b - Micro update, Added some features\
  Added: Mouse input via `u_MouseMove`. Now you can control some objects in your shader
* v0.0.0.0_a - Initial version, functional test\
  Implemented: Text field fo code, button for compiling shader and canvas for rendering\
  Features:
  * Compiling shader
  * Using time label and renderer resolution
