@stackmeister/unit
======================

Unit conversion library

Usage
=====

### Basic unit parsing and conversion

```ts
import { cssSystem, createTag } from '@stackmeister/unit'

const css = createTag(cssSystem)

css`2rem`
  .with({ rootFontSize: 16 })
  .px
  .toString()
//> "32px"
```

### Calculator for units

It's equally simple as the CSS `calc()` function, but can be used with any system.

```ts
import { lengthSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(lengthSystem)

calc`12km - 200m`.cm.toString()
//> "1180000cm"
```

### Convert between systems

```ts
import { lengthSystem, cssSystem, createTag } from '@stackmeister/unit'

const len = createTag(lengthSystem)

len`12km`
  .toSystem(cssSystem, 'cm')
  .with({ pixelRatio: 2 })
  .px
  .toString()
//> "90708662.4px"
```


Supported Standard Systems
==========================

### CSS System

Configurable based on the screen and surroundings. This is a full example (All values are optional).

Supported units: `px`, `vw/vh/vmin/vmax` (through `viewWidth/viewHeight`), `rem/em`, `mm/cm`, `%` (through `width`), `in`, `pt`, `pc`, `ch` (through `zeroWidth`)

```ts
import { createCssSystem, createCalculator } from '@stackmeister/unit'

const myCssSystem = createCssSystem({
  rootFontSize: 18,
  fontSize: 18,
  width: 0,
  height: 0,
  viewWidth: 1920,
  viewHeight: 1080,
  pixelRatio: 1,
  zeroWidth: 16,
}}

const calc = createCalculator(myCssSystem)

calc`20px - 1rem`.toString()
//> "2px"
```

### Amount of Substance (Mol)

Units: All SI Units

```ts
import { amountOfSubstanceSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(amountOfSubstanceSystem)

calc`12mol - 100mmol`.toString()
//> "11.9mol"
```

### Electric Current (Ampere)

Units: All SI Units

```ts
import { electricCurrentSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(electricCurrentSystem)

calc`12A - 100mA`.toString()
//> "11.9A"
```

### Length (Meter)

Units: All SI Units, all imperial units, astronomical units (`ae` etc.)

```ts
import { lengthSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(lengthSystem)

calc`12m - 100mm`.toString()
//> "11.9m"
```

### Luminous Intensity (Candela)

Units: All SI Units

```ts
import { luminousIntensitySystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(luminousIntensitySystem)

calc`12cd - 100mcd`.toString()
//> "11.9cd"
```

### Mass System (Gram)

Units: All SI Units

```ts
import { luminousIntensitySystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(luminousIntensitySystem)

calc`12cd - 100mcd`.toString()
//> "11.9cd"
```


### Temperature System (Kelvin)

Units: All SI Units, Celsius, Fahrenheit

```ts
import { temperatureSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(temperatureSystem)

calc`12K - 100°C`.toString()
//> "-361.15K"
```


### Time System (Seconds)

Units: All SI Units, `m` (Minute), `h` (Hour), `d` (Days), `w` (Weeks), `M` (Months), `y` (Years)

Notice the calculations are simple conversions, no calendar is used. Don't build anything critical
on the result of `M` and `y` here, but for e.g. a "x time ago" display for chat messages would be suitable.

```ts
import { timeSystem, createCalculator } from '@stackmeister/unit'

const calc = createCalculator(timeSystem)

calc`12w - 13d`.d.toString()
//> "71d"
```

### Create a custom system

```ts
import { createSystem } from '@stackmeister/unit'

const mySystem = createSystem({
  baseUnit: 'flux',
  from: {
    foo: value => value * 42.42,
  },
  to: {
    foo: value => value / 42.42,
  }
})

const calc = createCalculator(mySystem)

calc`12flux * 2foo`.toString()
//> "1018.08flux"
```



