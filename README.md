# Info
This is implementation of `Game of Life`, created by John Conway.
I created HTML5 canvas inplementation of this.
It's avalible on [Github](https://github.com/dekrain/Game-of-Life).
To play, go to [this site](https://dekrain.github.io/Game-of-Life/).
Work in Progress.
~DeKrain

# Rules
* Each cell has 8 neighbors
```
___
_X_
___
```
* Each cell has state either alive, or dead
```
_ -> dead

X -> alive
```
* On game:
 - If dead cell has exactly 3 neighbors, it born ( .../3 )
 ```
 X__       ???
 ___ ====> ?X?
 XX_       ???
 ```
 - If alive cell hasn't 2 or 3 neighbors, it dies ( 23/... )
 ```
 _XX       ???
 _XX ====> ?_?
 X_X       ???
 ```

# Modifications
Game of Life is designed main for standard rules. It's 2/23 neighbors to survive and 3 for born.
Rules syntax is: \<neighs for survive\>/\<neighs for born\>.
So, standard rules is: 23/3.
You can change this rules anytime, just enter `?pattern=<your pattern>` after URL, for example [https://dekrain.github.io/Game-of-Life/?pattern=23/3](https://dekrain.github.io/Game-of-Life/?pattern=23/3) for standard rules (it can be ommited).