
package bank.management.system;

import javax.swing.*;
import java.awt.*;
import java.util.*;
import com.toedter.calendar.JDateChooser;

public class SignupOne extends JFrame{
    
    SignupOne(){
        
        //Setbound only works when setlayout is null
        setLayout(null);
        Random ran = new Random();
        long random =  Math.abs((ran.nextLong() % 9000L)+1000L);
        
        JLabel formno = new JLabel("APPLICATION FORM NO. " + random );
        formno.setFont(new Font("Raleway", Font.BOLD , 38));
        formno.setBounds(140,20,600,40);
        add(formno);
        
        
        
        JLabel personDetails = new JLabel("Page 1: Personal Details");
        personDetails.setFont(new Font("Raleway", Font.BOLD , 22));
        personDetails.setBounds(290,80,400,30);
        add(personDetails);
        
        
        JLabel name = new JLabel("Name:");
        name.setFont(new Font("Raleway", Font.BOLD , 20));
        name.setBounds(100,140,100,30);
        add(name);
        
        JTextField nameTextField = new JTextField();
        nameTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        nameTextField.setBounds(300,140,400, 30);
        add(nameTextField);
        
        JLabel fname = new JLabel("Father's name:");
        fname.setFont(new Font("Raleway", Font.BOLD , 20));
        fname.setBounds(100,190,200,30);
        add(fname);
        
        JTextField fnameTextField = new JTextField();
        fnameTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        fnameTextField.setBounds(300,190,400, 30);
        add(fnameTextField);
        
        JLabel dob = new JLabel("Date of Birth:");
        dob.setFont(new Font("Raleway", Font.BOLD , 20));
        dob.setBounds(100,240,200,30);
        add(dob);
        
        JDateChooser dateChooser = new JDateChooser();
        dateChooser.setBounds(300,240,400,30);
        dateChooser.setForeground(new Color(105,105,105));
        add(dateChooser);
        
        JLabel gender = new JLabel("Gender:");
        gender.setFont(new Font("Raleway", Font.BOLD , 20));
        gender.setBounds(100,290,200,30);
        add(gender);
        
        JRadioButton male = new JRadioButton("Male");
        male.setBounds(300,290,60,30);
        male.setBackground(Color.WHITE);
        add(male);

                
        JRadioButton female = new JRadioButton("Female");
        female.setBounds(450,290,120,30);
        female.setBackground(Color.WHITE);
        add(female);

        ButtonGroup gendergroup = new ButtonGroup();
        gendergroup.add(male);
        gendergroup.add(female);
        
        
        JLabel email = new JLabel("Email Address:");
        email.setFont(new Font("Raleway", Font.BOLD ,20));
        email.setBounds(100,340,200,30);
        add(email);
        
        JTextField emailTextField = new JTextField();
        emailTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        emailTextField.setBounds(300,340,400, 30);
        add(emailTextField);
        
        JLabel address = new JLabel("Address:");
        address.setFont(new Font("Raleway", Font.BOLD ,20));
        address.setBounds(100,390,200,30);
        add(address);
        
        JTextField addressTextField = new JTextField();
        addressTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        addressTextField.setBounds(300,390,400, 30);
        add(addressTextField);
        
        JLabel city = new JLabel("City:");
        city.setFont(new Font("Raleway", Font.BOLD ,20));
        city.setBounds(100,440,200,30);
        add(city);
        
        JTextField cityTextField = new JTextField();
        cityTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        cityTextField.setBounds(300,440,400, 30);
        add(cityTextField);
        
        JLabel province = new JLabel("Province:");
        province.setFont(new Font("Raleway", Font.BOLD ,20));
        province.setBounds(100,490,200,30);
        add(province);
        
        JTextField provinceTextField = new JTextField();
        provinceTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        provinceTextField.setBounds(300,490,400, 30);
        add(provinceTextField);
        
        JLabel postalcode = new JLabel("Postal Code:");
        postalcode.setFont(new Font("Raleway", Font.BOLD ,20));
        postalcode.setBounds(100,540,200,30);
        add(postalcode);
        
        JTextField postalcodeTextField = new JTextField();
        postalcodeTextField.setFont(new Font("Raleway" , Font.BOLD , 14));
        postalcodeTextField.setBounds(300,540,400, 30);
        add(postalcodeTextField);
        
        
        JButton next = new JButton("Next");
        next.setBackground(Color.BLACK);
        next.setForeground(Color.WHITE);
        next.setFont(new Font("Raleway",Font.BOLD,14));
        next.setBounds(620,600,80,30);
        add(next);
        
        
        getContentPane().setBackground(Color.WHITE);
        setSize(850,800);
        setLocation(350,10);
        setVisible(true);
    }
    
    public static void main(String args[]){
        new SignupOne();
        
    }
}
