# Promise_A_plus_practice 
Promise A+ practice 



# step1
 第一步先看看a+规范

    Promise States
    
    A promise must be in one of three states: pending, fulfilled, or rejected.

    When pending, a promise:
        1.may transition to either the fulfilled or rejected state.
    
    When fulfilled, a promise:
        1.must not transition to any other state.
        2.must have a value, which must not change.
    
    When rejected, a promise:
        1.must not transition to any other state.
        2.must have a reason, which must not change.
    
    Here, “must not change” means immutable identity (i.e. ===), but does not imply deep immutability


 大概意思是有三个状态 pending, fulfilled, rejected

 pending状态可以转换成fulfilled和rejected状态
 转换为fulfilled，value必须有值，并且不能修改 
 转换成rejected状态 reason必须有值
    