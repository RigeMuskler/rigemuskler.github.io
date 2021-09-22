// PRELOADER

$(window).load(function(){
    $('.preloader').delay(1000).fadeOut("slow"); // set duration in brackets    
});


//check for MetaMask as web3 provider
async function checkMetaMask(){
	// modern browsers
	if (window.ethereum){
		window.web3 = new Web3(window.ethereum);
		try {
			//Request account access
			await ethereum.enable();
			//accounts exposed
			return true;
		}catch(error){
			//denied access
			return false;
		}
	}

	//legacy browsers
	else if (window.web3){
		window.web3 = new Web3(web3.currentProvider);
		//accounts always exposed
		return true;
	}
	// no dapp browser
	else {
		return false;
	}
}


//for the current profile holder - takes smart contract as arg
async function getProfile(_smartContract){
	var holder = await _smartContract.methods.checkCurrentHolder().call();
	//show status Div
	$('#statusSpinnerDiv').hide();
	$('#statusDiv').show();
	$('#statusAddress').text('Address: '+holder[0]);
	
	//convert timestamp to date
	var timestamp = parseInt(holder[1]);
	var date = new Date(timestamp*1000);
	fullDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	
	$('#statusUpdateTime').text('Updated: '+fullDate);
	$('#statusAmount').text('Amount: '+(holder[2]/(10**18))+' BNB');
	$('#statusText').text(holder[3]);
					
}

//get the club information (Data) -takes smartcontract as arg
async function getClubInfo(_smartContract){
	var info = await _smartContract.methods.getClubData().call();
	//show status Div
	$('#clubInfoDivSpinner').hide();
	$('#clubInfoDiv').show();
	$('#numMembers').text(info[0] + " / 100 Members");
	$('#stakeAmount').text(info[1]/(10**18) + " BNB");
	//secs to days
	var days = (parseInt(info[2])/86400).toFixed(2);
	$('#periodRequired').text(info[2] + " secs | "+days +" day(s)");
	//fee to int
	var fees = (parseInt(info[3])/10);
	$('#profileFee').text(fees+ "%")
	
}


//get accountInfo - takes smart contract as arg
async function getAccountInfo(_smartContract){
	//get current user account
	var account = await web3.eth.getAccounts((error,result) => {
		        if (error) {
		            console.log(error);
		        } else {
		            return result[0];
		        }
		    });

	var accountInfo = await _smartContract.methods.checkAccountInfo(account[0]).call();
	//show status Div
	$('#accountInfoSpinnerDiv').hide();
	$('#accountInfoDiv').show();
	//check if isMember
	if (accountInfo[0] == false){
		$('#isMember').text("Not A Member");
	}
	else{
		$('#isMember').text('Proud Member!');
	}
	
	$('#pendingRefund').text(accountInfo[1]/(10**18) + " BNB");
	//secs to days
	var days = (parseInt(accountInfo[2])/86400).toFixed(2);
	$('#activePeriod').text(accountInfo[2] + " secs | "+days +" day(s)");

	//secs to days
	var days = (parseInt(accountInfo[3])/86400).toFixed(2);
	$('#periodRemaining').text(accountInfo[3] + " secs | "+days +" day(s)");

	
}




// HOME BACKGROUND SLIDESHOW
$(function(){
	//global variable for the smart contract
	var smartcontract;
	
	//check for internet connection
    window.addEventListener('offline',() => $('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">There is no Internet Connection  &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>'));


    jQuery(document).ready(function() {
    	//slideshow
		$('body').backstretch([
	 		 "images/bsc/tm-bg-slide-1.jpg", 
	 		 "images/bsc/tm-bg-slide-2.jpg",
			 "images/bsc/tm-bg-slide-3.jpg",
			 "images/bsc/tm-bg-slide-4.jpg",
			 "images/bsc/tm-bg-slide-5.jpg"
	 			], 	{duration: 3200, fade: 1300});

		//for connecting web3 provider
		$('#connectWalletButton').click( async function(){
			var hasMetaMask = await checkMetaMask();

			if (hasMetaMask){
				//hide connectWalletButton
				$('#connectWalletButton').hide();
				//show connectedWalletButton
				$('#connectedWalletButton').show();

				//show tools Div
				$('#toolsDivSpinner').hide();
				$('#toolsDiv').show();

				//get smart contract
				var smartContractABI = [{"name":"Withdraw","inputs":[{"name":"addr","type":"address","indexed":true},{"name":"amount","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Win","inputs":[{"name":"addr","type":"address","indexed":true},{"name":"amount","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"JoinClub","inputs":[{"name":"memberIndex","type":"int128","indexed":false},{"name":"addr","type":"address","indexed":false}],"anonymous":false,"type":"event"},{"name":"StepDown","inputs":[{"name":"addr","type":"address","indexed":true},{"name":"amount","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[{"name":"_minimumStake","type":"uint256"},{"name":"_requiredMembershipPeriod","type":"uint256"},{"name":"_timeToAdd","type":"uint256"},{"name":"_platformFee","type":"uint256"},{"name":"_defaultStatus","type":"string"}],"outputs":[]},{"stateMutability":"payable","type":"function","name":"vieForProfile","inputs":[{"name":"_status","type":"string"}],"outputs":[{"name":"","type":"bool"}],"gas":625116},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[],"outputs":[{"name":"","type":"bool"}],"gas":61731},{"stateMutability":"nonpayable","type":"function","name":"stepDown","inputs":[],"outputs":[{"name":"","type":"bool"}],"gas":588778},{"stateMutability":"nonpayable","type":"function","name":"joinClub","inputs":[],"outputs":[{"name":"","type":"bool"}],"gas":125864},{"stateMutability":"view","type":"function","name":"checkPeriodRemaining","inputs":[{"name":"_addr","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":12301},{"stateMutability":"view","type":"function","name":"checkMembershipPeriod","inputs":[{"name":"_addr","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3411},{"stateMutability":"view","type":"function","name":"checkMembership","inputs":[{"name":"_addr","type":"address"}],"outputs":[{"name":"","type":"bool"}],"gas":3441},{"stateMutability":"view","type":"function","name":"checkCurrentHolder","inputs":[],"outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"string"}],"gas":47855},{"stateMutability":"view","type":"function","name":"checkCurrentStake","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":5349},{"stateMutability":"view","type":"function","name":"checkNumMembers","inputs":[],"outputs":[{"name":"","type":"int128"}],"gas":3220},{"stateMutability":"view","type":"function","name":"checkAccountInfo","inputs":[{"name":"_addr","type":"address"}],"outputs":[{"name":"","type":"bool"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"gas":20764},{"stateMutability":"view","type":"function","name":"getClubData","inputs":[],"outputs":[{"name":"","type":"int128"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"uint256"}],"gas":12550},{"stateMutability":"payable","type":"fallback"},{"stateMutability":"nonpayable","type":"function","name":"update","inputs":[{"name":"_minimumStake","type":"uint256"},{"name":"_platformFee","type":"uint256"},{"name":"_requiredMembershipPeriod","type":"uint256"},{"name":"_timeToAdd","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":142996},{"stateMutability":"nonpayable","type":"function","name":"updateDefaultStatus","inputs":[{"name":"_status","type":"string"}],"outputs":[{"name":"","type":"bool"}],"gas":390177},{"stateMutability":"nonpayable","type":"function","name":"updateTreasuryAccount","inputs":[{"name":"_addr","type":"address"}],"outputs":[{"name":"","type":"bool"}],"gas":38100},{"stateMutability":"nonpayable","type":"function","name":"collectFees","inputs":[{"name":"_amount","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":83447}];
				var bscContractAddress = "0xcf77baf560431aae9e6f4e99f29a76e5cf3dea2d";
				smartContract = new web3.eth.Contract(smartContractABI);
				smartContract.options.address = bscContractAddress;

				//events
				//Win event. Emitted when profile updated
				smartContract.events.Win({})
					.on('data', async function(event){
						//update the profile, accountInfo and clubInfo
						//get profile
						getProfile(smartContract);

						//get accountInfo
						getAccountInfo(smartContract);

						//get clubInfo
						getClubInfo(smartContract);
						$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Congratulations to the new Profile Holder! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
					})
					.on('error', console.error);

				//JoinClub event. Emitted when someone joins the members club
				smartContract.events.JoinClub({})
					.on('data', async function(event){
						//get clubInfo
						getClubInfo(smartContract);
						$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Congratulations to the new proud club Member! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
					})
					.on('error', console.error);

				//stepDown event. Emitted when someone steps down as the current profile holder
				smartContract.events.StepDown({})
					.on('data', async function(event){
						//get profile
						getProfile(smartContract);
						//get clubInfo
						getClubInfo(smartContract);

						//get accountInfo
						getAccountInfo(smartContract);
						$('#alertDiv').html('<div class="alert alert-info" role="alert"><p style="text-align:center">The Current Profile Holder Has stepped Down. This is your opportunity to become the new Profile Holder! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
					})
					.on('error', console.error);
				
				//get profile
				getProfile(smartContract);

				//get clubInfo
				getClubInfo(smartContract);

				//get AccountInfo
				getAccountInfo(smartContract);
		
               
			}
			else{
				$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">No Binance Smart Chain compactible browser! Kindly Consider installing MetaMask  &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
			}

		})
		

    
        $('#updateStatusNowButton').click(async function(){
        	if($('#updateStatusTextarea').val() !== ""){
        		//hide the button and modalbody
        		$('#updateStatusNowButton').hide();
        		$('#updateStatusModalBody').hide();
        		//show the spinner
        		$('#updateStatusModalSpinner').show();


        		//get current user account
				var account = await web3.eth.getAccounts((error,result) => {
					        if (error) {
					            console.log(error);
					        } else {
					            return result[0];
					        }
					    });

				//the status
				var status = $('#updateStatusTextarea').val();

				//the value 
				var amount = $('#inputAmount').val()*10**18;
				var valueAmount = ""+amount

				//send transaction
				var res = await smartContract.methods.vieForProfile(status).send({from: account[0], value: valueAmount});

        		//close the modal
        		//show the button and modalbody
        		$('#updateStatusNowButton').show();
        		$('#updateStatusModalBody').show();
        		//hide the spinner
        		$('#updateStatusModalSpinner').hide();
        		$('#updateStatusModal').modal('hide');
				
				//scroll to the top
	    		$('html, body').animate({
        		scrollTop: $("#alertDiv").offset().top
    			}, 2000);

        		//check the status of the transaction whether success or fail
        		if (res.status){
        			//clear status textarea
        			$('#updateStatusTextarea').val("");
        			//clear the amount
        			$('#inputAmount').val("");
        			//get profile
					getProfile(smartContract);

					//get accountInfo
					getAccountInfo(smartContract);

					//get clubInfo
					getClubInfo(smartContract);

					//alert
					$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Status Updated Successfully! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
        		}
        		else{
        			$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">Transaction failed. Kindly Try Again. &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');

        		}
				
        	}
        });
		

		$('#withdrawNowButton').click(async function(){

        	//hide the button and modalbody
    		$('#withdrawNowButton').hide();
    		$('#withdrawModalBody').hide();
    		//show the spinner
    		$('#withdrawModalSpinner').show();

        	//get current user account
			var account = await web3.eth.getAccounts((error,result) => {
				        if (error) {
				            console.log(error);
				        } else {
				            return result[0];
				        }
				    });

			var res = await smartContract.methods.withdraw().send({from: account[0]});

			//close the modal
        	//show the button and modalbody
    		$('#withdrawNowButton').show();
    		$('#withdrawModalBody').show();
    		//hide the spinner
    		$('#withdrawModalSpinner').hide();
    		$('#withdrawModal').modal('hide');
			
			//scroll to the top
			$('html, body').animate({
			scrollTop: $("#alertDiv").offset().top
			}, 2000);

			//check the status of the transaction whether success or fail
    		if (res.status){

				//get accountInfo
				getAccountInfo(smartContract);

				//alert
				$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Pending Refunds Withdrawn Successfully! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
    		}
    		else{
    			$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">Transaction failed. Kindly Try Again. &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');

    		}

    	    
        });
		
		$('#stepDownNowButton').click(async function(){

			//hide the button and modalbody
    		$('#stepDownNowButton').hide();
    		$('#stepDownModalBody').hide();
    		//show the spinner
    		$('#stepDownModalSpinner').show();
        	
        	//get current user account
			var account = await web3.eth.getAccounts((error,result) => {
				        if (error) {
				            console.log(error);
				        } else {
				            return result[0];
				        }
				    });

			var res = await smartContract.methods.stepDown().send({from: account[0]});
			
			//close the modal
    		//show the button and modalbody
    		$('#stepDownNowButton').show();
    		$('#stepDownModalBody').show();
    		//hide the spinner
    		$('#stepDownModalSpinner').hide();
    		$('#stepDownModal').modal('hide');
			
			//scroll to the top
			$('html, body').animate({
			scrollTop: $("#alertDiv").offset().top
			}, 2000);

    		//check the status of the transaction whether success or fail
    		if (res.status){

    			//get profile
				getProfile(smartContract);

				//get accountInfo
				getAccountInfo(smartContract);

				//get clubInfo
				getClubInfo(smartContract);

				//alert
				$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Stepped Down Successfully! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
    		}
    		else{
    			$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">Transaction failed. Kindly Try Again. &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');

    		}
    	    
        });


		$('#joinNowButton').click(async function(){

			//hide the button and modalbody
    		$('#joinNowButton').hide();
    		$('#joinClubModalBody').hide();
    		//show the spinner
    		$('#joinClubModalSpinner').show();
        	
        	//get current user account
			var account = await web3.eth.getAccounts((error,result) => {
				        if (error) {
				            console.log(error);
				        } else {
				            return result[0];
				        }
				    });

			var res = await smartContract.methods.joinClub().send({from: account[0]});
			
			//close the modal
    		//hide the button and modalbody
    		$('#joinNowButton').show();
    		$('#joinClubModalBody').show();
    		//show the spinner
    		$('#joinClubModalSpinner').hide();
    		$('#joinClubModal').modal('hide');
			
			//scroll to the top
			$('html, body').animate({
			scrollTop: $("#alertDiv").offset().top
			}, 2000);

    		//check the status of the transaction whether success or fail
    		if (res.status){

				//get accountInfo
				getAccountInfo(smartContract);

				//get clubInfo
				getClubInfo(smartContract);

				//alert
				$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">Congratulations!!! You are now a proud member! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
    		}
    		else{
    			$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">Transaction failed. Kindly Try Again. &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');

    		}
    	    
        });
		
		//connect to the mainnet
		$('#mainnetButton').click(function(){
			window.location.href = 'https://cryptoflex.club/'
		});
		

		$('#checkMembershipButton').click(async function(){
        	if($('#checkMembershipTextarea').val() !== ""){

        		//hide the button and modalbody
				$('#checkMembershipButton').hide();
				$('#checkMembershipModalBody').hide();
				//show the spinner
				$('#checkMembershipModalSpinner').show();

        		//get current user account
				var account = await web3.eth.getAccounts((error,result) => {
					        if (error) {
					            console.log(error);
					        } else {
					            return result[0];
					        }
					    });

				//the address
				var address = $('#checkMembershipTextarea').val();

				//clear the textarea
				$('#checkMembershipTextarea').val("");

				var isMember = await smartContract.methods.checkMembership(address).call();
				
				//close the modal
	    		//show the button and modalbody
	    		$('#checkMembershipButton').show();
	    		$('#checkMembershipModalBody').show();
	    		//hide the spinner
	    		$('#checkMembershipModalSpinner').hide();
	    		$('#checkMembershipModal').modal('hide');

	    		//scroll to the top
	    		$('html, body').animate({
        		scrollTop: $("#alertDiv").offset().top
    			}, 2000);

	    		//check whether is a member or not
	    		if (isMember){
					//alert
					$('#alertDiv').html('<div class="alert alert-success" role="alert"><p style="text-align:center">This is a proud member of the crypto flex club! &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');
	    		}
	    		else{
	    			$('#alertDiv').html('<div class="alert alert-danger" role="alert"><p style="text-align:center">Not A Member &nbsp <span> <a href="#" data-dismiss="alert" class="badge badge-info"> Close</a></span></p></div>');

	    		}
        	}
        });

	




		});
		
		
})




