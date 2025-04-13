.data
select: .word 1
n: .word 13
arr: .word 5,4,3,2,5,10,23,100,1,2,1,1,2

.text
lui x2,0x10000
lw x3,0(x2)
lw x4,0x4(x2)
addi x5,x2,0x8
addi x6,x2,0x500

addi x7,x0,0
copy:
    beq x7,x4,exitcopy
    slli x30,x7,2
    add x8,x5,x30
    add x9,x6,x30
    lw x10,0(x8)
    sw x10,0(x9)
    addi x7,x7,1
    beq x0,x0,copy
exitcopy:   

blt x0,x3,optimised

addi x7,x0,0
addi x30,x4,-1
outer:
    beq x7,x4,exit
    addi x7,x7,1
    addi x8,x0,0
    inner:
        beq x8,x30,outer
        slli x31,x8,2
        add x11,x6,x31
        lw x9,0(x11)
        lw x10,0x4(x11)
        blt x10,x9,swap
        addi x8,x8,1
        beq x0,x0,inner
    swap:
        sw x9,0x4(x11)
        sw x10,0(x11)
        addi x8,x8,1
        beq x0,x0,inner 
        
optimised:
addi x7,x0,0
addi x30,x4,0
addi x20,x3,0
out: 
   beq x7,x4,exit
   beq x20,x0,exit
   addi x20,x0,0
   addi x7,x7,1
   addi x8,x0,0
   sub x30,x30,x7
   in:
    beq x8,x30,outer
    slli x31,x8,2
    add x11,x6,x31 
    lw x9,0(x11)
    lw x10,0x4(x11)
    blt x10,x11,sw
    addi x8,x8,1
    beq x0,x0,inner
    sw:
        sw x9,0x4(x11)
        sw x10,0(x11)
        addi x8,x8,1
        addi x20,x0,1
        beq x0,x0,in   
exit: