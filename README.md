# JSFOO FRONTEND ASSIGNMENT

SUPER EFFICIENT DRAWING BOARD

## Why should I do it?

1.  The best solution will receive an Amazon Kindle
    <br /><br />
    <img src="https://images-na.ssl-images-amazon.com/images/I/51hrdzXLUHL.jpg" width=100>

2.  The second best solution will receive a Sony Headphone
    <br /><br />
    <img src="https://brain-images-ssl.cdn.dixons.com/4/9/10145294/u_10145294.jpg" width=100>

## Ok... But what am I supposed to do?

* [ ] [COOL DRAW](#cool-draw)
* [ ] [DISTANCE CALCULATOR](#distance-calculator)
* [ ] [REPLAY](#replay)

## COOL DRAW

1.  Implement a basic canvas
2.  Implement the logic to draw lines on this canvas

## DISTANCE CALCULATOR

1.  Implement a logic to calculate the amount of distance covered while drawing on the canvas.
2.  Consider each pixel to be 1 meter.

## REPLAY

1.  Implement a logic to replay the drawing events.
2.  This should be time based. Supposed the second pixel was drawn on the canvas after 1 second of the first pixel drawn, then this should also be reflected in the replay as well.
3.  Store the events in a way that you require the least amount of data to replay the whole drawing.
4.  This data should be as compressed as possible.
5.  The data should be as minimal as possible.

Ex: Suppose to draw a line, you used events in the following order

    1. mouseDown
    2. drag(s)
    3. mouseUp

Example:

```
[
  {
    type: 'down',
    x-point: 0,
    y-point: 0
  },
  {
    type: 'drag',
    x-point: 1,
    y-point: 0
  },
  {
    type: 'drag',
    x-point: 2,
    y-point: 0
  },
  {
    type: 'up',
    x-point: 2,
    y-point: 0
  }
]
```

Then you need to reduce the overall size of the array, and the size of the individual objects.

## Hmm... And how will you evaluate it?

1.  The code quality.
2.  The accuracy of the various logics involved.
3.  The optimization of the logic to compress the data required to replay the session.

## But how will I submit my solution?

1.  Raise a pull request (PR) for this repository

## How will you guys contact me?

1.  Mention your details here:
    1.  Name: Varenya Thyagaraj
    2.  Email: varen90@gmail.com
    3.  Contact Number: 9620473835
    4.  Company Name: Equal Experts
