# Generated by Django 5.0.6 on 2024-11-10 04:07

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("authentication", "0006_userprofile_cover_image_userprofile_profile_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="email",
            field=models.CharField(default="", max_length=50),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="full_name",
            field=models.CharField(default=1, max_length=255),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="program",
            field=models.CharField(default="1", max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="program_id",
            field=models.CharField(default=1, max_length=200),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="role",
            field=models.CharField(default="student", max_length=100),
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="semester",
            field=models.CharField(default=1, max_length=10),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name="userprofile",
            name="year_of_study",
            field=models.CharField(default=1, max_length=10),
            preserve_default=False,
        ),
    ]
