#!/usr/bin/env python3

import unittest
import os
import sys
import requests

import utils_test

import time



sys.path.append(os.path.abspath('engram'))

import engram










def assert_saved_correctly(uri):
	"""ensure that a url saved correctly to the database.
	"""

	is_up_uri = uri if ':' in uri else 'http://' + uri

	try:

		response = requests.get(is_up_uri, headers = {
			'Connection': 'close'
		}, timeout = 10)

		assert response.status_code == 200

		response.connection.close()

	except Exception as err:
		pass
	else:

		print ('============== ' + uri)

		response = requests.get('http://localhost:5000' + '/' + uri, headers = {
			'Connection': 'close'
		}, timeout = 10)

		assert response.status_code in {204, 404}, "%s failed with %d" % (uri, response.status_code)

		response.connection.close()




class TestSave(utils_test.EngramTestCase):

	def test_save_http(self):
		"""
		Story: Saving HTTP links.

		Scenario: saving URIs
		Given a running engram server
		And a working URI
		When the client submits the URI as a path
		Then the server should return a 'no content' status code.
		"""

		iris = [
			"http://graphemica.com/💩",
			"http://þorn.info/",
			"http://山东大学.cn/",
			"http://ar.wikipedia.org/wiki/إليزابيث_الأولى_ملكة_إنجلترا"
		]

		often_breaking = [
			"baidu.com/",
			"山东大学.cn/",
			"a8.net/",
			"weather.com/",
			"pagesperso-orange.fr/",
			"http://artyom.me/lens-over-tea-1"
		]





		# -- 500 most visited websites.

		uris = ["facebook.com/","twitter.com/","google.com/","youtube.com/","wordpress.org/","adobe.com/","blogspot.com/","wikipedia.org/","linkedin.com/","wordpress.com/","yahoo.com/","amazon.com/","flickr.com/","pinterest.com/","tumblr.com/","w3.org/","apple.com/","myspace.com/","vimeo.com/","microsoft.com/","youtu.be/","qq.com/","digg.com/", "stumbleupon.com/","addthis.com/","statcounter.com/","feedburner.com/","miibeian.gov.cn/","delicious.com/","nytimes.com/","reddit.com/","weebly.com/","bbc.co.uk/","blogger.com/","msn.com/","macromedia.com/","goo.gl/","instagram.com/","gov.uk/","icio.us/","yandex.ru/","cnn.com/","webs.com/","google.de/","t.co/","livejournal.com/","imdb.com/","mail.ru/","jimdo.com/","sourceforge.net/","go.com/","tinyurl.com/","vk.com/","google.co.jp/","fc2.com/","free.fr/","joomla.org/","creativecommons.org/","typepad.com/","networkadvertising.org/","technorati.com/","sina.com.cn/","hugedomains.com/","about.com/","theguardian.com/","yahoo.co.jp/","nih.gov/","huffingtonpost.com/","google.co.uk/","mozilla.org/","51.la/","aol.com/","ebay.com/","ameblo.jp/","wsj.com/","europa.eu/","taobao.com/","bing.com/","rambler.ru/","guardian.co.uk/","tripod.com/","godaddy.com/","issuu.com/","gnu.org/","geocities.com/","slideshare.net/","wix.com/","mapquest.com/","washingtonpost.com/","homestead.com/","reuters.com/","163.com/","photobucket.com/","forbes.com/","clickbank.net/","weibo.com/","etsy.com/","amazon.co.uk/","dailymotion.com/","soundcloud.com/","usatoday.com/","yelp.com/","cnet.com/","posterous.com/","telegraph.co.uk/","archive.org/","google.fr/","constantcontact.com/","phoca.cz/","phpbb.com/","latimes.com/","e-recht24.de/","rakuten.co.jp/","amazon.de/","opera.com/","miitbeian.gov.cn/","php.net/","scribd.com/","bbb.org/","parallels.com/","ning.com/","dailymail.co.uk/","cdc.gov/","sohu.com/","wikimedia.org/","deviantart.com/","mit.edu/","sakura.ne.jp/","altervista.org/","addtoany.com/","time.com/","google.it/","stanford.edu/","live.com/","alibaba.com/","squidoo.com/","harvard.edu/","gravatar.com/","histats.com/","nasa.gov/","npr.org/","ca.gov/","eventbrite.com/","wired.com/","amazon.co.jp/","nbcnews.com/","blog.com/","amazonaws.com/","bloomberg.com/","narod.ru/","blinklist.com/","imageshack.us/","kickstarter.com/","hatena.ne.jp/","nifty.com/","angelfire.com/","google.es/","ocn.ne.jp/","over-blog.com/","dedecms.com/","google.ca/","pbs.org/","ibm.com/","cpanel.net/","prweb.com/","bandcamp.com/","barnesandnoble.com/","mozilla.com/","noaa.gov/","goo.ne.jp/","comsenz.com/","xrea.com/","cbsnews.com/","foxnews.com/","discuz.net/","eepurl.com/","businessweek.com/","berkeley.edu/","newsvine.com/","bluehost.com/","geocities.jp/","loc.gov/","yolasite.com/","apache.org/","mashable.com/","usda.gov/","nationalgeographic.com/","whitehouse.gov/","tripadvisor.com/","ted.com/","sfgate.com/","biglobe.ne.jp/","epa.gov/","vkontakte.ru/","oracle.com/","seesaa.net/","examiner.com/","cornell.edu/","hp.com/","nps.gov/","disqus.com/","alexa.com/","mysql.com/","house.gov/","sphinn.com/","boston.com/","techcrunch.com/","un.org/","squarespace.com/","icq.com/","freewebs.com/","ezinearticles.com/","ucoz.ru/","independent.co.uk/","mediafire.com/","xinhuanet.com/","google.nl/","reverbnation.com/","imgur.com/","irs.gov/","webnode.com/","wunderground.com/","bizjournals.com/","who.int/","soup.io/","cloudflare.com/","people.com.cn/","ustream.tv/","senate.gov/","cbslocal.com/","ycombinator.com/","opensource.org/","spiegel.de/","oaic.gov.au/","nature.com/","businessinsider.com/","drupal.org/","last.fm/","privacy.gov.au/","skype.com/","wikia.com/","about.me/","webmd.com/","youku.com/","gmpg.org/","fda.gov/","redcross.org/","github.com/","cbc.ca/","umich.edu/","jugem.jp/","shinystat.com/","google.com.br/","ifeng.com/","mac.com/","wiley.com/","discovery.com/","topsy.com/","paypal.com/","google.cn/","surveymonkey.com/","moonfruit.com/","dropbox.com/","exblog.jp/","google.pl/","prnewswire.com/","ft.com/","uol.com.br/","behance.net/","goodreads.com/","netvibes.com/","auda.org.au/","marketwatch.com/","ed.gov/","networksolutions.com/","state.gov/","sitemeter.com/","liveinternet.ru/","ftc.gov/","census.gov/","quantcast.com/","economist.com/","nydailynews.com/","zdnet.com/","cafepress.com/","ow.ly/","meetup.com/","netscape.com/","chicagotribune.com/","theatlantic.com/","google.com.au/","1688.com/","skyrock.com/","list-manage.com/", "cdbaby.com/","friendfeed.com/","ehow.com/","patch.com/","upenn.edu/","engadget.com/","diigo.com/","com.com/","slashdot.org/","washington.edu/","columbia.edu/","nhs.uk/","abc.net.au/","elegantthemes.com/","utexas.edu/","yale.edu/","marriott.com/","bigcartel.com/","ucla.edu/","usgs.gov/","jigsy.com/","hexun.com/","hubpages.com/","slate.com/","purevolume.com/","umn.edu/","bloglines.com/","so-net.ne.jp/","wikispaces.com/","cargocollective.com/","howstuffworks.com/","plala.or.jp/","infoseek.co.jp/","jiathis.com/","usnews.com/","xing.com/","flavors.me/","desdev.cn/","hc360.com/","usa.gov/","edublogs.org/","lycos.com/","wisc.edu/","thetimes.co.uk/","state.tx.us/","example.com/","shareasale.com/","biblegateway.com/","is.gd/","yellowbook.com/","samsung.com/","businesswire.com/","g.co/","dion.ne.jp/","dagondesign.com/","theglobeandmail.com/","booking.com/","storify.com/","salon.com/","ucoz.com/","gizmodo.com/","psu.edu/","smh.com.au/","reference.com/","sun.com/","unicef.org/","devhub.com/","artisteer.com/","unesco.org/","istockphoto.com/","answers.com/","trellian.com/","cocolog-nifty.com/","i2i.jp/","t-online.de/","intel.com/","1und1.de/","ebay.co.uk/","sciencedaily.com/","paginegialle.it/","ask.com/","springer.com/","canalblog.com/","timesonline.co.uk/","de.vu/","deliciousdays.com/","smugmug.com/","wufoo.com/","globo.com/","cmu.edu/","domainmarket.com/","odnoklassniki.ru/","twitpic.com/","ovh.net/","home.pl/","naver.com/","google.ru/","si.edu/","newyorker.com/","blogs.com/","sciencedirect.com/","hibu.com/","hud.gov/","hhs.gov/","dmoz.org/","dot.gov/","cyberchimps.com/","google.com.hk/","jalbum.net/","craigslist.org/","zimbio.com/","chronoengine.com/","cnbc.com/","uiuc.edu/","vistaprint.com/","symantec.com/","prlog.org/","360.cn/","indiatimes.com/","mtv.com/","webeden.co.uk/","java.com/","cisco.com/","japanpost.jp/","4shared.com/","github.io/","mayoclinic.com/","studiopress.com/","admin.ch/","virginia.edu/","printfriendly.com/","mlb.com/","omniture.com/","simplemachines.org/","dell.com/","accuweather.com/","princeton.edu/","fotki.com/","comcast.net/","chron.com/","nyu.edu/","wp.com/","merriam-webster.com/","nba.com/","shop-pro.jp/","lulu.com/","furl.net/","indiegogo.com/","buzzfeed.com/","tuttocitta.it/","ox.ac.uk/","mapy.cz/","army.mil/","csmonitor.com/","bravesites.com/","tamu.edu/","rediff.com/","toplist.cz/","yellowpages.com/","va.gov/","tiny.cc/","netlog.com/","elpais.com/","oakley.com/","multiply.com/","tmall.com/","hostgator.com/","nymag.com/","fema.gov/","blogtalkradio.com/","china.com.cn/","unblog.fr/","fastcompany.com/","earthlink.net/","vinaora.com/","msu.edu/","aboutads.info/","ucsd.edu/","sogou.com/","seattletimes.com/","dyndns.org/","123-reg.co.uk/","sbwire.com/","tinypic.com/","acquirethisname.com/","shutterfly.com/","walmart.com/","pen.io/","arizona.edu/","woothemes.com/","scientificamerican.com/","themeforest.net/","spotify.com/","cam.ac.uk/","unc.edu/","arstechnica.com/","hao123.com/","illinois.edu/","bloglovin.com/","nsw.gov.au/","ihg.com/","pcworld.com/"]

		[assert_saved_correctly(iri) for iri in iris]
		[assert_saved_correctly(uri) for uri in often_breaking]
		[assert_saved_correctly(uri) for uri in uris]





unittest.main()
