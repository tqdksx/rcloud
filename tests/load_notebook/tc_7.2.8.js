/*
 Author: Prateek
 Description:The notebook will be loaded based on their GitHub URL. The GitHub URL 
 * will refer to some deleted notebook belonging to the some different user
 */

//Begin Test
casper.test.begin("Using GitHub URL of some deleted notebook (different user)", 3, function suite(test) {
    var x = require('casper').selectXPath;
    var github_username = casper.cli.options.username;
    var github_password = casper.cli.options.password;
    var rcloud_url = casper.cli.options.url;
    var functions = require(fs.absolute('basicfunctions'));
    var GitHub_URL = 'https://gist.github.com/Prateek032/cca9eab15d6471abcfbd';//Deleted Notebook GitHub_URL of different user
    
    casper.start(rcloud_url, function () {
        functions.inject_jquery(casper);
    });
    casper.wait(10000);

    casper.viewport(1024, 768).then(function () {
        functions.login(casper, github_username, github_password, rcloud_url);
    });

    casper.viewport(1024, 768).then(function () {
        this.wait(9000);
        console.log("validating that the Main page has got loaded properly by detecting if some of its elements are visible. Here we are checking for Shareable Link and Logout options");
        functions.validation(casper);
    });
    
    functions.create_notebook(casper);
    
    casper.viewport(1024, 768).then(function () {
        this.wait(4000);
        var url = this.getCurrentUrl();
        this.thenOpen(url);
        this.wait(8000);
        var current_title = functions.notebookname(casper);
        this.echo("Title of currently loaded Notebook : " + current_title);
        this.echo("Notebook owner = " + this.fetchText({type: 'css', path: '#notebook-author'}));
    });
    
    casper.then(function () {
        functions.open_advanceddiv(casper);
		this.echo("Clicking on dropdown");
        this.wait(2999);
        casper.setFilter("page.prompt", function (msg, currentValue) {
            if (msg === "Enter notebook ID or github URL:") {
                return GitHub_URL;
            }
        });
        this.click("#open_from_github");
        this.echo("Opening Notebook using Load Notebook ID");
        this.wait(10000);
    });

    casper.then(function () {
        var url = this.getCurrentUrl();
        this.thenOpen(url);
        this.wait(8000);
        Notebook_id1 = url.substring(41, 73);
        console.log( Notebook_id1);
		var current_title = functions.notebookname(casper);
        this.echo("Title of currently loaded Notebook : " + current_title);
        this.echo("Notebook owner = " + this.fetchText({type: 'css', path: '#notebook-author'}));
        console.log('Using URL of deleted notebook of different user is opened using Load notebook id/URL');
	});
	
	casper.run(function () {
        test.done();
    });
});
