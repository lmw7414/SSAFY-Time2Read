package org.ssafy.bibibig.container;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class MemberController {
    @GetMapping("/")
    public String test(){
        return "afs";
    }
}
