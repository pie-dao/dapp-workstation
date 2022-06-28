You will need to deploy xLOOKS on the local network from his how repo.

forge script scripts/Deploy.sol:MyScript --rpc-url http://localhost:8545 --private-key 0x.. --broadcast --legacy

Then change the constand in the looks script
Then send yourself some looks with 

npm run transfer looks

And finally test that everything works 

npm run run:fork scripts/xLOOKS/xlooks.tsd


--------------------
What seems to be the issue

There is no correspondance between the xLOOKS user share and the contract shares