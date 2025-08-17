import os
def main():
    hollywood = set()
    print("Previous Color:")
    prev = input()
    print("New Color:")
    newc = input()
    hollywood = set()
    for file in os.listdir("heisefootball/templates"):
        hollywood.add("heisefootball/templates/"+file.rstrip("/n"))
    hollywood.add("heisefootball/static/tired.css")
    for holly in hollywood:
        elton = []
        with open(holly,"r") as file:
            for line in file:
                elton.append(line.replace(prev,newc))
        with open(holly,"w") as file:
            for line in elton:
                file.write(line)

def hello():
    for file in os.listdir("heisefootball/templates"):
        print(file)
if __name__ == '__main__':
    main()
