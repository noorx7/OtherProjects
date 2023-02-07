/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package bank.management.system;
import java.sql.*;

public class Conn {
    Connection c;
    Statement s;
    public Conn(){
        try{
            //Registering the driver 
            c = DriverManager.getConnection("jdbc:mysql:///bankmanagementsystem", "root", "Bugs17072002!");
            s = c.createStatement();
        
        } catch(Exception e){
            System.out.println(e);
        }
    }
}
