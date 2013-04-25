class Logger
	severityData:
		debug: 
			level: 1
			prefix: '[c="color: green"]DEBUG[c]'
		info: 
			level: 3
			prefix: '[c="color: blue"]INFO[c]'
		warning: 
			level: 5
			prefix: '[c="color: orange"]WARNING[c]'
		error: 
			level: 7
			prefix: '[c="color: red"]ERROR[c]'
		fatal: 
			level: 9
			prefix: '[c="color: red"]FATAL[c]'

	constructor: ( @options ) ->
		@severity = @severityData[@options.severity]?.level or 5
		return

	print: ( type, context, message, additional... ) =>
		
		if not message?
			message = method
			method = null

		contextname = context.constructor.name

		_type = type.toLowerCase()

		# only log when the provided severity is at least equal to the log level in the configuration
		if @severityData[_type]? and @severityData[_type].level >= @severity
			_msg = "#{@severityData[_type].prefix}: "
			if context?
				_msg += " `#{contextname}` "
			_msg += "#{message}"
			
			if additional.length
				@log( _msg, additional )
			else
				@log( _msg )
		return

	log : =>
		args = []

		@makeArray(arguments).forEach (arg) =>
				if typeof arg is 'string'
						args = args.concat @stringToArgs arg

				else
						args.push arg

		@_log.apply window, args

	_log : =>
		console.log.apply console, @makeArray(arguments)

	makeArray: (arrayLikeThing) =>
			Array::slice.call arrayLikeThing

	formats: [{
			# Italic
			regex: /\*([^\*)]+)\*/
			replacer: (m, p1) -> "%c#{p1}%c"
			styles: -> ['font-style: italic', '']
	}, {
			# Bold
			regex: /\_([^\_)]+)\_/
			replacer: (m, p1) -> "%c#{p1}%c"
			styles: -> ['font-weight: bold', '']
	}, {
			# Code
			regex: /\`([^\`)]+)\`/
			replacer: (m, p1) -> "%c#{p1}%c"
			styles: -> ['background: rgb(255, 255, 219); padding: 1px 5px; border: 1px solid rgba(0, 0, 0, 0.1)', '']
	}, {
			# Custom syntax: [c="color: red"]red[c]
			regex: /\[c\=\"([^\")]+)\"\]([^\[)]+)\[c\]/
			replacer: (m, p1, p2) -> "%c#{p2}%c"
			styles: (match) -> [match[1], '']
	}]

	hasMatches: (str) =>
		_hasMatches = false

		@formats.forEach (format) ->
				if format.regex.test str
						_hasMatches = true

		return _hasMatches

	getOrderedMatches: (str) =>
		matches = []

		@formats.forEach (format) ->
				match = str.match format.regex
				if match
						matches.push
								format: format
								match: match

		return matches.sort((a, b) -> a.match.index - b.match.index)

	stringToArgs: (str) =>
		styles = []

		while @hasMatches str
				matches = @getOrderedMatches str
				firstMatch = matches[0]
				str = str.replace firstMatch.format.regex, firstMatch.format.replacer
				styles = styles.concat firstMatch.format.styles(firstMatch.match)

		[str].concat styles

	# TODO - replace these with a feature test
	isSafari : => /Safari/.test(navigator.userAgent) and /Apple Computer/.test(navigator.vendor)
	isIE : => /MSIE/.test(navigator.userAgent)

	# Safari starting supporting stylized logs in Nightly 537.38+
	# See https://github.com/adamschwartz/log/issues/6
	safariSupport : =>
		m = navigator.userAgent.match /AppleWebKit\/(\d+)\.(\d+)(\.|\+|\s)/
		return false unless m
		return 537.38 >= parseInt(m[1], 10) + (parseInt(m[2], 10) / 100)

		# Export
		if (@isSafari() and not @safariSupport()) or @isIE()
				window.log = _log
		else
				window.log = log
		window.log.l = _log