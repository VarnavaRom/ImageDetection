// node-prompt.js v0.1.0
//
// Copyright (c) 2011 by Geerten van Meel
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

(function(objExport) {
	
	// private members
	var _paused = true;
	var _message = '';
	var _buffer = '';
	var _callback = null;
	var _password = false;
	
	// get bindings
	var stdin = process.openStdin(), 
		stdio = process.binding("stdio");
		
	// set properties
	stdio.setRawMode();
	stdin.setEncoding('utf8');

	// eventlistener, listen for data
	stdin.on("data", function (chunk) {
		
		// skip if input is paused
		if (_paused == true) return;
		
		// convert chunk to string
		chunk = chunk + "";

		// switch through 
		switch (chunk) {
			
			// EOL characters
			case "\n": case "\r": case "\u0004": 	

				// quit input mode
				stdin.pause();
				process.stdout.write("\n\r\n\r");
				_paused = true;
				
				// run callback
				_callback(_buffer);
				break;
			
			// arrow keys, do the same as backspace
			case "\u1b5b43": case "\u1b5b44": case "\u1b5b42":  case "\u1b5b41": 				
			
			// backspace - clear any input
			case "\u007f":
				_buffer = '';
				process.stdout.write("\n\r\n\r" + _message + "\n\r> ");
				break;
			
			// empty input / send null to callback
			case "\u0003": // CRTL + C
			case "\u001b": // escape
				_buffer = '';
				stdin.pause();
				paused = true;
				_callback(null);
				break;
			
			// add chunk to buffer
			default:
				// output data to screen
				if (_password !== false)
					process.stdout.write('*');
					else process.stdout.write(chunk);
					
				// add data to buffer
				_buffer += chunk;
				break;
		}

	}); // EventListener stdin.on("data")
	
	
	// prompt a question
	objExport.prompt = function(message, callback, is_password) {
		
		// default values
		_callback = null;
		_message = "> ";
		_password = (is_password == true) ? true : false;
		_buffer = '';
		_paused = false;
		stdin.resume();
		
		// reference callback function 
		if (typeof(callback) == 'function') _callback = callback;

		// message provided as first argument
		if (typeof(message) == 'string') _message = message + "\n\r> ";
		
		// no message provided, just a callback function
		if (typeof(message) == 'function') _callback = message;
		
		// no callback has been set = error
		if (_callback === null) 
		{
			// output warning, leave function
			console.log('Warning: Invalid arguments for prompt(). Usage: prompt( [message], [callback] );');
			return null;
		}
		
		// ouput message
		process.stdout.write("\n\r\n\r" + _message);
		
	} // .prompt()
	
	// shorthand function for password prompting
	objExport.password = function(message, callback) 
	{
		return objExport.prompt(message, callback, true);	
		
	} // .password()
	
	
	// cancel input prompt
	objExport.cancel = function() 
	{
		// quit input mode
		_paused = true;
		stdin.pause();
		process.stdout.write("\n\r\n\r");
		
	} // .cancel()
	
})(exports);
