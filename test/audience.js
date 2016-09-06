var expect = require('chai').expect;
var audience = require('../libs/audience.js');
require('mocha-sinon');

describe("Audience Module", function() {
	describe("Update Audience Members", function() {
		beforeEach(function() {
			this.sinon.stub(console, 'log');
		});
		it ("updates the audience table", function(){
			audience.createUpdateMembers();
			//expect( console.log.calledOnce ).to.be.true;
    		//expect( console.log.calledWith('Audience table updated') ).to.be.true;
    		done();
		});
	});

	describe("Get First Seen", function() {
	});

	describe("Get Top Trolls", function() {
	});

	describe("Increment TrollCount", function() {

	});
});