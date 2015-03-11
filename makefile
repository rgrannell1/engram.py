
JC     = babel
SOURCE = $(shell find src -name "*.es6")
LIB    = $(SRC:public/src/%.es6=public/lib/%.js)

$(LIB): $(SRC)
	mkdir -p $(@D)
	$(JC) $< -o $@
