import os 



def main():
    #dynamically import images from images current folder
    #create random function
    with open("getRandomImage.tsx", "w") as f:
        files = []
        for filename in os.listdir("./backgrounds"):
            if filename.endswith(".jpg") or filename.endswith(".png"):
                filed = filename.split(".")[0]
                files.append(filed)
                f.write(f"import {filed} from './backgrounds/{filename}' \n")
        f.write("let images = [\n")
        for filename in files:
            f.write(f"\t{filename},\n")
        f.write("]\n")
        f.write("export function getRandomImage() {\n")
        f.write("\treturn images[Math.floor(Math.random() * images.length)]\n")
        f.write("}\n")

if __name__ == "__main__":
    main()
