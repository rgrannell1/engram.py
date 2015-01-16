
const system = require("system")

const args   = system.args

const url    = args[0]
const page   = require("webpage").create()





page.open(url, function (status) {

	if (status === "success") {

		const title = page.evaluate(function () {
			return document.title;
		})

		if (title) {

			system.stdout.write(title)
			phantom.exit(0)

		} else {

			system.stderr.write('empty document title.\n')
			phantom.exit(1)

		}

	} else {

		system.stderr.write('failed.\n')
		phantom.exit(1)

	}

})
