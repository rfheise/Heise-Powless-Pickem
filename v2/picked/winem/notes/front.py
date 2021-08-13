def gimme(bruh):
    dollar = False
    girl = []
    boy = []
    for bru in bruh:
        if bru == "$$$":
            dollar = True
        else:
            if dollar:
                girl.append(bru)
            else:
                boy.append(bru)
    return [boy,girl]

import json
bruh = []
with open("./dorms.txt","r") as f:
    for line in f:
        bruh.append(line.strip("\n"))
bruh = gimme(bruh)
juice = []
for i in range(len(bruh[0])):
    juice.append({"name":bruh[0][i],"abbr":bruh[1][i]})
with open("./all.txt","w") as f:
    f.write(json.dumps(juice))
