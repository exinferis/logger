## Logger

> Console.log with style

### What?
Based on the great work of Adam Schwartz (http://adamschwartz.co) this little module brings a stylable logger class which can be used within your own apps.

### Features

- Safely call `logger.print` (instead of `console.log`) in any browser.
- Use markdown syntax for quick formatting:
    - *italic* &mdash; `log('this is *italic*')`
    - **bold** &mdash; `log('this word _bold_')`
    - `code` &mdash; ``log('this word `code`')``
- Use a custom syntax to style text however you want: `log('this is [c="color: red"]red[c]')`.

### Support

Stylized logs are supported in the following browsers:

- Chrome 26+
- Firefox with Firebug
- Safari Nightly (537.38+)

### Usage

```
logger = new Logger( severity: "info" )

logger.print( level, context, message, additional ) 
```

**String** `level`: can be anything from this list: **debug, info, warning, error, fatal**  
**String** `context`: The current context to be diplayed, very useful for webapps using "classes" or different bound contexts  
**String | Object | Array** `message`: Main message to display  
**Any** `additional`: Additional data to display…can be anything


