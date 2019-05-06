class Person{
    constructor(name,age){
        this.name = name
        this.age = age
    }

    static static_fun(){
        console.log(0)
    }

    sya_age(){
        console.log(this.age)
    }

    say(){
        this.sya_age()
        console.log(this.name)
    }


}
let p = new Person("zs",19)
p.say()
Person.static_fun()