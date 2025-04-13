.data
n: .asciiz "ayush"

.text 

addi x4 , x0 , 4

jal x1 , target
addi x4 , x4 , 8
beq x0 , x0 ,exit
target:
addi x4 , x4 , 2
jalr x3 , x1 , 0
exit: