Large Map Memory Management:

https://spencerwie.github.io/Large%20Map%20Memory/memOut.html

This is a test to show the management of huge amounts of items. In this case there is a single player and 100,000 moving blocks. This is implemented by checked distance of each block, although all blocks need to be checked, the distance formula is basic and only requires addition and basic multiplcation. If the block is out of range it performs no operations such as (drawing on screen, collision checked, etc).

This is just a general approach. A better way would be a Cluster system in which will take longer to set up we can assign "chunks" and assign them to some n amount of blocks. That way there is much less distance checking with distance and we can add even more blocks. I will implment this later and do a million+ blocks. Currently the program runs around 4-6% CPU of my CPU (i5-3337U processor CPU with 1.8GHz clockrate).

This was much simpler then I expected. So I will optimize this system. It will be applied to my Digging Game (Gold Mine), in a much needed update. I'm also going to use this in a new game I plan on making Block Run 2(JS or Python or C++), based on a older game Block Run(made in Python).
