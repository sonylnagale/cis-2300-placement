#
# conditionals
#

x = 5
y = 10
z = 15
a = 20

if x > y and y < z:
    if z > a:
        print("z is the largest number.")
    else:
        print("a is the largest number.")
elif y > x and x < z:   
    if z > y or True:
        print("z is the largest number.")
    else:
        print("y is the largest number.")
else:
    if y > x:
        print("y is the largest number.")
    else:
        print("x is the largest number.")

# answer
# z is the largest number.


# 
# for loops
#

def figure(max_num):
    for line in range(1, max_num + 1):
        for dots in range(1, max_num - line + 1):
            print(".", end="")
        print(line)
        
figure(8)


# answer
# .......8
# ......7
# .....6
# ....5
# ...4
# ..3
# .2
# 1

# 
# while loops
# 

total_chars = 0
sentinel = "quit"
prompt = 'Type a word (or "' + sentinel +'" to quit): '
word = input(prompt)
while word != sentinel:
    total_chars += len(word)
    word = input(prompt)
print("The total number of characters is:", total_chars)

# answer
# The total number of characters is: 2



dict1 = {
    "a": {"apple", "avocado", "apricot"},
    "b": {"banana", "blueberry", "blackberry"},
    "c": {"cherry", "cranberry", "citrus"}
}

dict2 = {}

for key in dict1:
    for n in dict1[key]:
        dict2[n] = key

print(dict2)

# answer
# {'avocado': 'a', 'apple': 'a', 'apricot': 'a', 'banana': 'b', 'blueberry': 'b', 'blackberry': 'b', 'cherry': 'c', 'cranberry': 'c', 'citrus': 'c'}

# wrong answer 1 (swapped: maps letter → fruit instead of fruit → letter)
# {'a': 'apricot', 'b': 'blackberry', 'c': 'citrus'}

# wrong answer 2 (thinks dict2 ends up a copy of dict1)
# {'a': {'apple', 'avocado', 'apricot'}, 'b': {'banana', 'blueberry', 'blackberry'}, 'c': {'cherry', 'cranberry', 'citrus'}}


def apply_discount(price, discount):
    saving = price * discount
    final = price - saving
    return final

result = apply_discount(80, 0.25)
print(result)


def mystery(x, values):
    for el in values:
        if len(el) < x:
            return True
    return False

values = ["hello", "banana", "lime", "lemon", "apple", "strawberry", "grape", "kiwi"]
mystery1 = mystery(3, values)
print("Mystery 1:", mystery1)
mystery2 = mystery(5, values)
print("Mystery 2:", mystery2)

pairs = {}
for i in range(0, len(values), 2):
    pairs[values[i]] = values[i + 1]

print(pairs)
