# Simple simulation environment for automated chairs

## Getting started

Install build dependencies:
`npm install`

Run webpack with watch and dev server:
`npm run start`

## Example

`src/Simulation.js` contains the actual simulation class
`src/app.js` contains an example for the usage of the simulation environment.

## API

### Simulation

**constructor(options:object)**

**options** 

_element_ DOM element simulation rendering should happen in; document.body by default.

_chairCount_ The number of chairs to create in simulation. Can be left blank when 'positions' is used. 1 by default.

_samplingRate_ The number of position updates for all chair per second. 10 by default

_friction_ Friction of the ground. Delegated to matterjs. 0.1 by default.

_width Width_ of the simulation canvas in pixels. 1000 by default.

_height Height_ of simulation canvas in pixels. 1000 by default.

_positions_ An array of pixel offsets {x: <value>, y: <value>} for each chair at the beginning of the simulation. If not present,  
    
**getChairControl:ChairControl**

Entry point to the actual chair control API. See `src/ChairAPI.ts` for documentation.